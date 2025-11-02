import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderBar } from "@/components/market360/HeaderBar";
import { PageContainer } from "@/components/market360/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package } from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    date: "Nov 1, 2025",
    status: "delivered",
    total: 950,
    items: [
      {
        title: "Professional Laptop - Business Edition",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-002",
    date: "Oct 28, 2025",
    status: "shipped",
    total: 850,
    items: [
      {
        title: "Security Camera System",
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-003",
    date: "Oct 25, 2025",
    status: "pending",
    total: 2000,
    items: [
      {
        title: "Mobile App Development Services",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400",
        quantity: 1,
      },
    ],
  },
];

export default function Orders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: "default",
      shipped: "secondary",
      pending: "outline",
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <PageContainer>
      <HeaderBar title="My Orders" />

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card 
                  key={order.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 mb-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="font-bold">Total: ${order.total}</span>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No {activeTab} orders</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
