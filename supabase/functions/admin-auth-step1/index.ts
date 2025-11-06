import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { passphrase, sessionToken } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Rate limiting check
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { data: recentAttempts } = await supabase
      .from('admin_auth_attempts')
      .select('id')
      .eq('ip_address', ip)
      .eq('step', 'step1')
      .gte('attempted_at', thirtyMinutesAgo);

    if (recentAttempts && recentAttempts.length >= 5) {
      await supabase.from('audit_logs').insert({
        action: 'admin_auth_rate_limited',
        resource_type: 'admin_auth',
        details: { step: 'step1', ip, userAgent },
        ip_address: ip,
        user_agent: userAgent
      });

      return new Response(
        JSON.stringify({ error: 'Too many attempts. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify passphrase
    const { data: secretData } = await supabase
      .from('admin_secrets')
      .select('passhash')
      .eq('label', 'step1')
      .single();

    if (!secretData) {
      throw new Error('Admin secrets not configured');
    }

    // Use crypt to verify password
    const { data: verifyResult } = await supabase.rpc('verify_password', {
      input_pass: passphrase,
      stored_hash: secretData.passhash
    }).single();

    const isValid = verifyResult === true;

    // Log attempt
    await supabase.from('admin_auth_attempts').insert({
      ip_address: ip,
      step: 'step1',
      success: isValid,
      attempted_at: new Date().toISOString()
    });

    await supabase.from('audit_logs').insert({
      action: isValid ? 'admin_auth_step1_success' : 'admin_auth_step1_failed',
      resource_type: 'admin_auth',
      details: { step: 'step1', ip, userAgent },
      ip_address: ip,
      user_agent: userAgent
    });

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid passphrase' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create or update session
    const newSessionToken = sessionToken || crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .upsert({
        session_token: newSessionToken,
        step1_verified: true,
        step2_verified: false,
        ip_address: ip,
        user_agent: userAgent,
        expires_at: expiresAt
      }, { onConflict: 'session_token' });

    if (sessionError) throw sessionError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionToken: newSessionToken,
        message: 'Step 1 verified. Proceed to step 2.'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Admin auth step1 error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});