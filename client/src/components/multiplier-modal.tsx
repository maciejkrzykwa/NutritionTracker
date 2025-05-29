import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface MultiplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMultiplier: string;
  productName: string;
  onUpdateMultiplier: (multiplier: string) => void;
}

export function MultiplierModal({
  isOpen,
  onClose,
  currentMultiplier,
  productName,
  onUpdateMultiplier,
}: MultiplierModalProps) {
  const [multiplier, setMultiplier] = useState(currentMultiplier);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numValue = parseFloat(multiplier);
    if (isNaN(numValue) || numValue < 0.1 || numValue > 10.0) {
      setError("Multiplier must be between 0.1 and 10.0");
      return;
    }
    
    onUpdateMultiplier(numValue.toFixed(1));
    onClose();
  };

  const handleClose = () => {
    setMultiplier(currentMultiplier);
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-slate-900">
              Edit Portion Size
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm text-slate-600 mb-2 block">Product</Label>
            <p className="font-medium text-slate-900">{productName}</p>
          </div>

          <div>
            <Label htmlFor="multiplier" className="text-sm text-slate-600 mb-2 block">
              Portion Multiplier
            </Label>
            <Input
              id="multiplier"
              type="number"
              step="0.1"
              min="0.1"
              max="10.0"
              value={multiplier}
              onChange={(e) => {
                setMultiplier(e.target.value);
                setError("");
              }}
              placeholder="1.0"
              className="text-center"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Enter a value between 0.1 and 10.0 (e.g., 0.5 for half portion, 2.0 for double)
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}