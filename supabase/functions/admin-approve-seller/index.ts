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

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No auth header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's auth
    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid user' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: roleCheck } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleCheck) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { applicationId, action, reviewNotes } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Get application
    const { data: application } = await supabase
      .from('seller_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (!application) {
      return new Response(
        JSON.stringify({ error: 'Application not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = application.user_id;

    if (action === 'approve') {
      // Update application
      await supabase
        .from('seller_applications')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes || 'Approved'
        })
        .eq('id', applicationId);

      // Add seller role
      await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'seller' })
        .select()
        .single();

      // Create store
      const appData = application.application_data as any;
      const businessName = appData?.business_name || 'New Store';
      const slug = businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      await supabase
        .from('stores')
        .insert({
          user_id: userId,
          name: businessName,
          slug: `${slug}-${Date.now()}`,
          status: 'active',
          description: appData?.business_description || ''
        });

      // Create notification
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'application_approved',
        title: 'Seller Application Approved',
        message: 'Congratulations! Your seller application has been approved. You can now start adding products.',
        read: false
      });

      // Audit log
      await supabase.from('audit_logs').insert({
        action: 'seller_application_approved',
        resource_type: 'seller_application',
        resource_id: applicationId,
        details: { userId, businessName },
        ip_address: ip
      });

      return new Response(
        JSON.stringify({ success: true, message: 'Application approved' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'reject') {
      // Update application
      await supabase
        .from('seller_applications')
        .update({ 
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes || 'Rejected'
        })
        .eq('id', applicationId);

      // Create notification
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'application_rejected',
        title: 'Seller Application Update',
        message: reviewNotes || 'Your seller application was not approved at this time.',
        read: false
      });

      // Audit log
      await supabase.from('audit_logs').insert({
        action: 'seller_application_rejected',
        resource_type: 'seller_application',
        resource_id: applicationId,
        details: { userId, reviewNotes },
        ip_address: ip
      });

      return new Response(
        JSON.stringify({ success: true, message: 'Application rejected' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Admin approve seller error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});