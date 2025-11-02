import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  TrendingUp,
  Eye,
  MessageCircle 
} from "lucide-react";

const stats = [
  { icon: DollarSign, label: "Total Sales", value: "$12,450", change: "+12%" },
  { icon: ShoppingBag, label: "Orders", value: "156", change: "+8%" },
  { icon: Package, label: "Products", value: "24", change: "+2" },
  { icon: Eye, label: "Views", value: "3,240", change: "+15%" },
];

export default function SellerDashboard() {
  const navigate = useNavigate();

  return (
    <PageContainer showBottomNav>
      <HeaderBar title="Seller Dashboard" showBack={false} />

      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="p-4">
          <h3 className="font-bold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate("/seller/products/new")}
              className="p-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Add Product
            </button>
            <button
              onClick={() => navigate("/seller/orders")}
              className="p-3 bg-muted rounded-lg text-sm font-medium"
            >
              View Orders
            </button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-4">
          <h3 className="font-bold mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">New order received</p>
                <p className="text-xs text-muted-foreground">Order #ORD-158 • $950</p>
              </div>
              <span className="text-xs text-muted-foreground">2m ago</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <MessageCircle className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">New message from buyer</p>
                <p className="text-xs text-muted-foreground">Inquiry about laptop specs</p>
              </div>
              <span className="text-xs text-muted-foreground">15m ago</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Package className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Product restocked</p>
                <p className="text-xs text-muted-foreground">Security Camera System</p>
              </div>
              <span className="text-xs text-muted-foreground">1h ago</span>
            </div>
          </div>
        </Card>

        {/* Performance Chart Placeholder */}
        <Card className="p-4">
          <h3 className="font-bold mb-3">Sales Overview</h3>
          <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Chart coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
