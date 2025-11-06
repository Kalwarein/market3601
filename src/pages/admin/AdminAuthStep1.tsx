import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/market360/PageContainer";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function AdminAuthStep1() {
  const [passphrase, setPassphrase] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-auth-step1', {
        body: { passphrase }
      });

      if (error) throw error;

      if (data.success) {
        localStorage.setItem('admin_session_token', data.sessionToken);
        toast.success(data.message);
        navigate('/admin/auth/step2');
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
                <div className="bg-primary/10 rounded-full p-3">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl">Admin Authentication</CardTitle>
              <CardDescription className="text-center">
                Step 1 of 2 - Enter first passphrase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passphrase">Passphrase #1</Label>
                  <Input
                    id="passphrase"
                    type="password"
                    placeholder="Enter first passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    This is a secure admin area. Contact the system administrator if you need access.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue to Step 2
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/auth')}
                    className="text-sm"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  🔒 This admin gate uses military-grade encryption and rate limiting.
                  All authentication attempts are logged and monitored.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}