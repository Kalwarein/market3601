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

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ error: 'Session token required. Complete step 1 first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify session from step1
    const { data: sessionData } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .eq('step1_verified', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!sessionData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session. Start from step 1.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { data: recentAttempts } = await supabase
      .from('admin_auth_attempts')
      .select('id')
      .eq('ip_address', ip)
      .eq('step', 'step2')
      .gte('attempted_at', thirtyMinutesAgo);

    if (recentAttempts && recentAttempts.length >= 5) {
      await supabase.from('audit_logs').insert({
        action: 'admin_auth_rate_limited',
        resource_type: 'admin_auth',
        details: { step: 'step2', ip, userAgent },
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
      .eq('label', 'step2')
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
      step: 'step2',
      success: isValid,
      attempted_at: new Date().toISOString()
    });

    await supabase.from('audit_logs').insert({
      action: isValid ? 'admin_auth_step2_success' : 'admin_auth_step2_failed',
      resource_type: 'admin_auth',
      details: { step: 'step2', ip, userAgent },
      ip_address: ip,
      user_agent: userAgent
    });

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid passphrase' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update session - both steps verified
    const { error: updateError } = await supabase
      .from('admin_sessions')
      .update({ 
        step2_verified: true,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      })
      .eq('session_token', sessionToken);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionToken,
        message: 'Admin authentication successful'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Admin auth step2 error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});