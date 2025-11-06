import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/market360/PageContainer";
import { Shield, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function AdminAuthStep2() {
  const [passphrase, setPassphrase] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionToken = localStorage.getItem('admin_session_token');
    if (!sessionToken) {
      toast.error('Please complete step 1 first');
      navigate('/admin/auth/step1');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      
      const { data, error } = await supabase.functions.invoke('admin-auth-step2', {
        body: { passphrase, sessionToken }
      });

      if (error) throw error;

      if (data.success) {
        localStorage.setItem('admin_session_token', data.sessionToken);
        localStorage.setItem('admin_session_verified', 'true');
        localStorage.setItem('admin_session_expires', String(Date.now() + 30 * 60 * 1000));
        toast.success(data.message);
        navigate('/admin/dashboard');
      } else {
        toast.error(data.error || 'Authentication failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer showBottomNav={false}>
      <div className="min-h-screen flex items-center justify-center bg-surface-1 px-4 py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-3">
              <div className="flex justify-center">
                <div className="bg-green-500/10 rounded-full p-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl">Admin Authentication</CardTitle>
              <CardDescription className="text-center">
                Step 2 of 2 - Enter second passphrase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-center text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Step 1 verified successfully
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passphrase">Passphrase #2</Label>
                  <Input
                    id="passphrase"
                    type="password"
                    placeholder="Enter second passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Final verification step. Your session will be valid for 30 minutes.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Authentication
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/admin/auth/step1')}
                    className="text-sm"
                  >
                    Back to Step 1
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  🔒 Two-factor passphrase authentication provides enhanced security.
                  Sessions expire after 30 minutes of authentication.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}