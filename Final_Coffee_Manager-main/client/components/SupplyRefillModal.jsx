import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function SupplyRefillModal({
  isOpen,
  onClose,
  supply,
  onRefill,
  canEdit,
}) {
  const [refillAmount, setRefillAmount] = useState([0]);
  const [isRefilling, setIsRefilling] = useState(false);

  const handleRefill = async () => {
    setIsRefilling(true);

    try {
      await onRefill(refillAmount[0]);
      setRefillAmount([0]);
      onClose();
    } catch (error) {
      console.error("Failed to refill supply:", error);
    } finally {
      setIsRefilling(false);
    }
  };

  const newLevel = Math.min(100, supply.current + refillAmount[0]);
  const totalCost = (refillAmount[0] / 100) * supply.cost;

  const getStatusColor = (level) => {
    if (level > 70) return "text-green-600";
    if (level > 30) return "text-orange-500";
    return "text-red-500";
  };

  const getStatusIcon = (level) => {
    if (level > 70) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <AlertTriangle className="w-4 h-4 text-orange-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {supply.icon}
            Refill {supply.name}
          </DialogTitle>
          <DialogDescription>
            Adjust the supply levels for this ingredient
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">Current Level</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(supply.current)}
                <span className={`text-lg font-bold ${getStatusColor(supply.current)}`}>
                  {supply.current}%
                </span>
              </div>
            </div>
            <Progress value={supply.current} className="w-20 h-2" />
          </div>

          {canEdit && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Refill Amount</label>
                  <Badge variant="outline">{refillAmount[0]}%</Badge>
                </div>
                <Slider
                  value={refillAmount}
                  onValueChange={setRefillAmount}
                  max={100 - supply.current}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>{100 - supply.current}% (Full)</span>
                </div>
              </div>

              {refillAmount[0] > 0 && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                  <h4 className="text-sm font-medium text-primary">Refill Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">After Refill</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(newLevel)}
                        <span className={`font-bold ${getStatusColor(newLevel)}`}>
                          {newLevel}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cost</p>
                      <p className="font-bold text-primary">${totalCost.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1" disabled={isRefilling}>
                  Cancel
                </Button>
                <Button onClick={handleRefill} disabled={refillAmount[0] === 0 || isRefilling} className="flex-1">
                  {isRefilling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Refilling...
                    </>
                  ) : (
                    <>Refill ({refillAmount[0]}%)</>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
