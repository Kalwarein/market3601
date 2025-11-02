import { useState } from "react";
import { Header } from "@/components/market360/Header";
import { BottomNav } from "@/components/market360/BottomNav";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Settings, 
  ChevronRight, 
  Heart, 
  Clock, 
  HelpCircle,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  BarChart3,
  CreditCard,
  MapPin,
  Ticket,
  History,
  Headphones,
  QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/mockData";

// Mock user state - TODO: Replace with auth system
const MOCK_IS_SELLER = false; // Toggle to test buyer vs seller views

export default function Profile() {
  const navigate = useNavigate();
  const [isSeller] = useState(MOCK_IS_SELLER);

  const featureItems = [
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: History, label: "Browsing history", path: "/history" },
    { icon: Ticket, label: "Coupons & credit", path: "/coupons" },
    { icon: CreditCard, label: "Payment", path: "/payment" },
    { icon: MapPin, label: "Shipping addresses", path: "/addresses" },
  ];

  const buyerMenuItems = [
    { icon: Headphones, label: "Help Center", path: "/help" },
    { icon: Settings, label: "Account Settings", path: "/settings" },
  ];

  const sellerMenuItems = [
    { icon: Store, label: "Manage Store", path: "/seller/store", highlight: true },
    { icon: Package, label: "My Products", path: "/seller/products" },
    { icon: ShoppingBag, label: "Orders", path: "/seller/orders" },
    { icon: DollarSign, label: "Earnings", path: "/seller/earnings" },
    { icon: BarChart3, label: "Analytics", path: "/seller/analytics" },
  ];

  const keepLookingProducts = products.slice(0, 4);
  const inspiredProducts = products.slice(4, 8);

  return (
    <div className="min-h-screen bg-surface-1 pb-24">
      <Header />

      {/* Profile Header */}
      <div className="bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Market360" />
              <AvatarFallback>WK</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold">Wello Kal</h2>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>Deliver to SL</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/support")}>
              <Headphones className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/scan")}>
              <QrCode className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-card px-4 py-4 mb-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Features</h3>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-6 pb-2">
            {featureItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-2 min-w-[70px]"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-center leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* My Orders */}
      <div className="bg-card px-4 py-4 mb-2">
        <button 
          onClick={() => navigate("/orders")}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-bold">My orders</h3>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Keep Looking For */}
      <div className="bg-card px-4 py-4 mb-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Keep looking for</h3>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-2">
            {keepLookingProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="min-w-[140px] flex-shrink-0"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-medium line-clamp-2 text-left">{product.title}</p>
                <p className="text-xs text-muted-foreground text-left">
                  {product.tags[0] === "services" ? "3 items" : `${product.moq || 1} item${product.moq && product.moq > 1 ? 's' : ''}`}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Promotional Banners */}
      <div className="px-4 mb-2">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <div className="text-2xl mb-2">💳</div>
            <h4 className="font-bold text-sm mb-1">Up to US$100 off with PayPal</h4>
            <p className="text-xs text-muted-foreground mb-2">Explore now &gt;</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="text-2xl mb-2">🎁</div>
            <h4 className="font-bold text-sm mb-1">Share & Earn</h4>
            <p className="text-xs text-muted-foreground mb-2">Get coupons &gt;</p>
          </Card>
        </div>
      </div>

      {/* Start Selling (Buyer Only) */}
      {!isSeller && (
        <div className="bg-card px-4 py-4 mb-2">
          <button
            onClick={() => navigate("/seller/setup")}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">Start selling on Market360</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Seller Dashboard (Seller Only) */}
      {isSeller && (
        <div className="px-4 mb-2">
          <h3 className="font-bold mb-3">Seller Dashboard</h3>
          <div className="space-y-2">
            {sellerMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full bg-card rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition-colors ${
                    item.highlight ? "border-2 border-primary" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${item.highlight ? "text-primary" : ""}`} />
                    <span className={`font-medium ${item.highlight ? "text-primary" : ""}`}>
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Inspired by your interests */}
      <div className="bg-card px-4 py-4 mb-2">
        <h3 className="font-bold mb-3">Inspired by your interests</h3>
        <ScrollArea className="w-full">
          <div className="flex gap-2 mb-3 pb-1">
            <Button size="sm" variant="default">All</Button>
            <Button size="sm" variant="ghost">Consumer Electronics</Button>
            <Button size="sm" variant="ghost">Jewelry, Eyewear</Button>
          </div>
        </ScrollArea>
        <div className="grid grid-cols-2 gap-3">
          {inspiredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="text-left"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-muted">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-medium line-clamp-2 mb-1">{product.title}</p>
              <p className="text-sm font-bold text-primary">
                US${product.price.amount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                MOQ: {product.moq || 1} Piece
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="px-4 space-y-2 mb-4">
        {buyerMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full bg-card rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      <BottomNav visible={true} />
    </div>
  );
}
