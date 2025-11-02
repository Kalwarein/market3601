import { useState } from "react";
import { Header } from "@/components/market360/Header";
import { BottomNav } from "@/components/market360/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Package, RefreshCcw, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/mockData";

// Mock cart data - TODO: Replace with database
const initialCartItems = [
  {
    id: "p_001",
    title: "Mobile App Development Services - Basic Package",
    price: 2000,
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400",
    quantity: 1,
  },
  {
    id: "p_006",
    title: "Professional Laptop - Business Edition",
    price: 950,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    quantity: 5,
  },
];

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50; // Mock shipping cost
  const total = subtotal + shipping;

  const recommendedProducts = products.slice(0, 4);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface-1 pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">Cart(0)</h1>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>To SL</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Package className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Empty State */}
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <div className="w-32 h-32 mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <rect x="50" y="60" width="100" height="80" rx="8" fill="currentColor" className="text-muted/20"/>
              <circle cx="70" cy="150" r="8" fill="currentColor" className="text-muted/40"/>
              <circle cx="130" cy="150" r="8" fill="currentColor" className="text-muted/40"/>
              <rect x="60" y="40" width="80" height="30" rx="4" fill="currentColor" className="text-muted/30"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-3">Your cart is empty</h2>
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full px-8 mb-8"
            onClick={() => navigate("/categories")}
          >
            Source by category
          </Button>

          {/* Trust Badges */}
          <div className="w-full max-w-md space-y-4 mb-8">
            <p className="font-medium text-left">You're protected on Market360.com</p>
            
            <div className="flex items-start gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Secure payment</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="text-xs px-2 py-1 bg-muted rounded">VISA</div>
                  <div className="text-xs px-2 py-1 bg-muted rounded">Mastercard</div>
                  <div className="text-xs px-2 py-1 bg-muted rounded">PayPal</div>
                  <div className="text-xs px-2 py-1 bg-muted rounded">GPay</div>
                  <span className="text-xs text-muted-foreground">...</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <RefreshCcw className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Refund and returns</p>
                <p className="text-xs text-muted-foreground">Easy returns within 30 days</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <Package className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Fulfillment by Market360 Logistics</p>
                <p className="text-xs text-muted-foreground">Fast and reliable delivery</p>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="w-full">
            <h3 className="text-lg font-bold mb-4 text-left">Recommended for you</h3>
            <div className="grid grid-cols-2 gap-3">
              {recommendedProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="text-left bg-card rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium line-clamp-2 mb-1">{product.title}</p>
                    <p className="text-sm font-bold text-primary">
                      US${product.price.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MOQ: {product.moq || 1}  •  {Math.floor(Math.random() * 1000)} sold
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <BottomNav visible={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-1 pb-40">
      <Header />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart ({cartItems.length})</h1>

        <div className="space-y-4 mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-card rounded-xl p-4 shadow-sm">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-primary font-bold mb-2">${item.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-muted rounded-lg">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Summary */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border p-4 safe-bottom z-30">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">${shipping}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total</span>
            <span className="text-primary">${total.toLocaleString()}</span>
          </div>
        </div>
        <Button size="lg" className="w-full" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </Button>
      </div>

      <BottomNav visible={true} />
    </div>
  );
}
