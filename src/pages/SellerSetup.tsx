import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Store, Upload, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SellerSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    category: "",
    description: "",
    address: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // TODO: Save to database when backend is ready
      // For now, just redirect to profile (seller view)
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-surface-1">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Become a Seller</h1>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-card border-b border-border">
        <div className="flex items-center justify-center gap-2 px-4 py-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  step >= num
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    step > num ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 max-w-2xl mx-auto">
        <Card className="p-6">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Store className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Store Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Tell us about your business
                  </p>
                </div>

                <div>
                  <Label htmlFor="storeName">Store Name *</Label>
                  <Input
                    id="storeName"
                    placeholder="Enter your store name"
                    value={formData.storeName}
                    onChange={(e) =>
                      setFormData({ ...formData, storeName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Business Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Consumer Electronics</SelectItem>
                      <SelectItem value="security">Security Equipment</SelectItem>
                      <SelectItem value="commercial">Commercial Equipment</SelectItem>
                      <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                      <SelectItem value="home">Home & Living</SelectItem>
                      <SelectItem value="services">Professional Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Store Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you sell..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">Contact Details</h2>
                  <p className="text-sm text-muted-foreground">
                    How can buyers reach you?
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+232 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Business Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Street, City, Region"
                    rows={3}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">Store Logo</h2>
                  <p className="text-sm text-muted-foreground">
                    Upload your business logo (optional)
                  </p>
                </div>

                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-primary mb-1">
                        You're almost ready!
                      </p>
                      <p className="text-muted-foreground">
                        After submission, your store will be reviewed and activated within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {step === 3 ? "Submit Application" : "Continue"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
