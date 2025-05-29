import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export function ProductSelectionModal({
  isOpen,
  onClose,
  onSelectProduct,
}: ProductSelectionModalProps) {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-slate-900">Add Food</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 rounded-lg h-16 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No products available</p>
              <p className="text-sm">Add products in the Products tab first</p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <Button
                  key={product.id}
                  variant="outline"
                  className="w-full h-auto p-4 justify-between hover:bg-slate-50"
                  onClick={() => onSelectProduct(product)}
                >
                  <div className="text-left">
                    <h4 className="font-medium text-slate-900">{product.name}</h4>
                    <div className="flex space-x-4 mt-1">
                      <span className="text-xs text-slate-600">
                        <span className="font-medium text-secondary">{product.protein}g</span> protein
                      </span>
                      <span className="text-xs text-slate-600">
                        <span className="font-medium text-accent">{product.fat}g</span> fat
                      </span>
                      <span className="text-xs text-slate-600">
                        <span className="font-medium text-primary">{product.carbs}g</span> carbs
                      </span>
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
