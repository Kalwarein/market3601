import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/market360/PageContainer";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Store, Package, FileText, Shield, Activity } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, hasRole } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalProducts: 0,
    pendingApplications: 0,
  });
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Wait for auth to load
      if (authLoading) return;

      // Check if user is logged in
      if (!user) {
        toast.error('Please sign in to access admin dashboard');
        navigate('/auth');
        return;
      }

      // Check if user has admin role
      if (!hasRole('admin')) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }

      // User is admin, fetch data
      setLoading(false);
      fetchStats();
      fetchApplications();
    };

    checkAdminAccess();
  }, [user, authLoading, hasRole, navigate]);

  const fetchStats = async () => {
    const [usersRes, storesRes, productsRes, appsRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('stores').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('seller_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    setStats({
      totalUsers: usersRes.count || 0,
      totalStores: storesRes.count || 0,
      totalProducts: productsRes.count || 0,
      pendingApplications: appsRes.count || 0
    });
  };

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('seller_applications')
      .select(`
        *,
        profiles:user_id (
          display_name,
          email
        )
      `)
      .order('submitted_at', { ascending: false })
      .limit(10);

    if (error) {
      toast.error("Failed to fetch applications");
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const handleApproveApplication = async (applicationId: string, userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-approve-seller', {
        body: { 
          applicationId, 
          action: 'approve'
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success("Application approved! Seller account created.");
        fetchApplications();
        fetchStats();
      } else {
        toast.error(data.error || 'Approval failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve application');
    }
  };

  const handleRejectApplication = async (applicationId: string, userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-approve-seller', {
        body: { 
          applicationId, 
          action: 'reject',
          reviewNotes: 'Application does not meet our current requirements'
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success("Application rejected.");
        fetchApplications();
        fetchStats();
      } else {
        toast.error(data.error || 'Rejection failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject application');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <PageContainer showBottomNav={false}>
      <HeaderBar title="Admin Dashboard" showBack />

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Store className="w-4 h-4" />
                Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStores}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.pendingApplications}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Seller Applications
            </CardTitle>
            <CardDescription>
              Review and approve seller applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.length === 0 && !loading && (
                <p className="text-center text-muted-foreground py-8">
                  No applications to review
                </p>
              )}

              {applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {app.application_data?.business_name || 'Business Name Not Provided'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {app.profiles?.display_name} ({app.profiles?.email})
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Country:</span>{" "}
                      {app.application_data?.country || 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Business Type:</span>{" "}
                      {app.application_data?.business_type || 'N/A'}
                    </div>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveApplication(app.id, app.user_id)}
                        className="flex-1"
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejectApplication(app.id, app.user_id)}
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
