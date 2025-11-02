import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/market360/Header";
import { BottomNav } from "@/components/market360/BottomNav";
import { CategoryChips } from "@/components/market360/CategoryChips";
import { ProductCarousel } from "@/components/market360/ProductCarousel";
import { Card } from "@/components/ui/card";
import { categories, products } from "@/data/mockData";
import { FileText, Grid3x3, Wand2, TrendingUp } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");

  const topDeals = products.filter((p) => p.promotion?.type === "flash" || p.promotion?.type === "deal");
  const newArrivals = products.filter((p) => p.promotion?.type === "new");
  const topRanking = products.slice(0, 6);

  const quickActions = [
    { 
      icon: FileText, 
      label: "Request for Quotation", 
      path: "/quotation",
      color: "from-blue-500/10 to-blue-500/5 border-blue-500/20" 
    },
    { 
      icon: Grid3x3, 
      label: "Source by Category", 
      path: "/categories",
      color: "from-green-500/10 to-green-500/5 border-green-500/20" 
    },
    { 
      icon: Wand2, 
      label: "Fast Customization", 
      path: "/customization",
      color: "from-purple-500/10 to-purple-500/5 border-purple-500/20" 
    },
    { 
      icon: TrendingUp, 
      label: "Top Ranking", 
      path: "/ranking",
      color: "from-orange-500/10 to-orange-500/5 border-orange-500/20" 
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-surface-1">
      <Header />
      
      {/* Quick Actions */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.path}
                className={`p-4 cursor-pointer hover:shadow-md transition-all bg-gradient-to-br ${action.color}`}
                onClick={() => navigate(action.path)}
              >
                <Icon className="w-8 h-8 text-primary mb-2" />
                <p className="font-bold text-sm">{action.label}</p>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="py-2">
        <CategoryChips
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      <ProductCarousel 
        title="Top Deals" 
        products={topDeals}
      />
      
      <ProductCarousel 
        title="Top Ranking" 
        products={topRanking}
      />
      
      {newArrivals.length > 0 && (
        <ProductCarousel 
          title="New Arrivals" 
          products={newArrivals}
        />
      )}

      <BottomNav visible={true} />
    </div>
  );
}
