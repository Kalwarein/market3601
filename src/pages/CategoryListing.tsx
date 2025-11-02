import { useState } from "react";
import { Grid3x3, List } from "lucide-react";
import { Header } from "@/components/market360/Header";
import { BottomNav } from "@/components/market360/BottomNav";
import { CategoryChips } from "@/components/market360/CategoryChips";
import { ProductCard } from "@/components/market360/ProductCard";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/data/mockData";

export default function CategoryListing() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.tags.includes(activeCategory));

  return (
    <div className="min-h-screen pb-24">
      <Header />
      
      {/* Sticky Filter Bar */}
      <div className="sticky top-[64px] z-40 bg-card border-b border-border">
        <div className="py-3">
          <CategoryChips
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
        
        <div className="flex items-center justify-between px-4 pb-3">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} products found
          </p>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={layout === "grid" ? "default" : "ghost"}
              onClick={() => setLayout("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={layout === "list" ? "default" : "ghost"}
              onClick={() => setLayout("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Grid/List */}
      <div className="p-4">
        {layout === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} layout="list" />
            ))}
          </div>
        )}
      </div>

      <BottomNav visible={true} />
    </div>
  );
}
