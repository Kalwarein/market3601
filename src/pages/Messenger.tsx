import { useState } from "react";
import { BottomNav } from "@/components/market360/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Bell, 
  MoreHorizontal, 
  ShoppingCart,
  Package,
  MoreVertical
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/mockData";

interface Conversation {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerCompany: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  productImage?: string;
}

const mockConversations: Conversation[] = [
  {
    id: "conv_1",
    sellerId: "s_01",
    sellerName: "Jessia TU",
    sellerCompany: "Zhanjiang Weitu Electronic Commerce Co., Ltd.",
    lastMessage: "ok",
    timestamp: "Friday",
    unread: true,
    productImage: "https://images.unsplash.com/photo-1592286927505-c80d0affd5c8?w=100",
  },
  {
    id: "conv_2",
    sellerId: "s_02",
    sellerName: "J CHOI",
    sellerCompany: "Xixun Trading (guangzhou) Ltd.",
    lastMessage: "hi",
    timestamp: "Friday",
    unread: true,
  },
];

export default function Messenger() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"orders" | "notifications" | "others">("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredConversations = mockConversations.filter(conv => 
    (filter === "all" || conv.unread) &&
    (searchQuery === "" || 
     conv.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     conv.sellerCompany.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const recommendedProducts = products.slice(5, 7);

  return (
    <div className="min-h-screen bg-surface-1 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Messenger</h1>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-around px-4 pb-3">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center gap-1 pb-2 ${
              activeTab === "orders" ? "border-b-2 border-primary" : ""
            }`}
          >
            <Package className="w-5 h-5" />
            <span className={`text-xs ${activeTab === "orders" ? "font-bold" : ""}`}>
              Orders
            </span>
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex flex-col items-center gap-1 pb-2 relative ${
              activeTab === "notifications" ? "border-b-2 border-primary" : ""
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                9
              </Badge>
            </div>
            <span className={`text-xs ${activeTab === "notifications" ? "font-bold" : ""}`}>
              Notifications
            </span>
          </button>
          <button
            onClick={() => setActiveTab("others")}
            className={`flex flex-col items-center gap-1 pb-2 ${
              activeTab === "others" ? "border-b-2 border-primary" : ""
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className={`text-xs ${activeTab === "others" ? "font-bold" : ""}`}>
              Others
            </span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-card border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search messages or suppliers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full bg-muted border-0"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-3">
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setFilter(filter === "unread" ? "all" : "unread")}
        >
          Unread
          {filteredConversations.filter(c => c.unread).length > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 rounded-full">{filteredConversations.filter(c => c.unread).length}</Badge>
          )}
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          My label
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => navigate(`/conversation/${conv.id}`)}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {conv.sellerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {conv.unread && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full">
                    1
                  </Badge>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm">{conv.sellerName}</h3>
                  <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1 truncate">
                  {conv.sellerCompany}
                </p>
                <p className="text-sm truncate">{conv.lastMessage}</p>
              </div>
              {conv.productImage && (
                <img
                  src={conv.productImage}
                  alt="Product"
                  className="w-12 h-12 rounded object-cover"
                />
              )}
            </button>
          ))}
        </div>

        {/* Info Message */}
        <div className="px-4 py-6 text-center">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="shrink-0">✓</span>
            <p>Up to 1,000 messages from the past 10 years can be loaded (messages may be limited by retention policies)</p>
          </div>
          <p className="text-xs text-green-600 mt-2">Updated at 12:54 PM</p>
        </div>

        {/* Recommended Products */}
        <div className="px-4 pb-4">
          <h3 className="font-bold mb-3">Recommended for you</h3>
          <ScrollArea className="w-full">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="shrink-0">All</Button>
              <Button variant="ghost" size="sm" className="shrink-0">Consumer Electronics</Button>
              <Button variant="ghost" size="sm" className="shrink-0">Jewelry, Eyewear, Watches</Button>
            </div>
          </ScrollArea>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {recommendedProducts.map((product) => (
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
                <p className="text-sm font-medium line-clamp-2">{product.title}</p>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <BottomNav visible={true} />
    </div>
  );
}
