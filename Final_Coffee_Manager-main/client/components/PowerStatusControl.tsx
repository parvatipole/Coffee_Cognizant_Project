import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Power, Zap, ZapOff, Clock, Shield, ShieldAlert } from "lucide-react";

interface PowerStatusControlProps {
  machineId: string;
  machineName: string;
  powerStatus: "online" | "offline";
  lastPowerUpdate: string;
  canEdit: boolean;
  onPowerStatusChange?: (newStatus: "online" | "offline") => void;
}

export default function PowerStatusControl({
  machineId,
  machineName,
  powerStatus,
  lastPowerUpdate,
  canEdit,
  onPowerStatusChange,
}: PowerStatusControlProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePowerToggle = async () => {
    if (!canEdit || !onPowerStatusChange) return;

    setIsUpdating(true);
    const newStatus = powerStatus === "online" ? "offline" : "online";

    // Simulate API call delay
    setTimeout(() => {
      onPowerStatusChange(newStatus);
      setIsUpdating(false);
    }, 500);
  };

  const isOnline = powerStatus === "online";

  return (
    <Card
      className="border-l-4"
      style={{ borderLeftColor: isOnline ? "#10b981" : "#ef4444" }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {isOnline ? (
            <Zap className="w-4 h-4 text-green-600" />
          ) : (
            <ZapOff className="w-4 h-4 text-red-600" />
          )}
          Power Status
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant={isOnline ? "default" : "destructive"}
              className="gap-1"
            >
              {isOnline ? (
                <Shield className="w-3 h-3" />
              ) : (
                <ShieldAlert className="w-3 h-3" />
              )}
              {isOnline ? "ONLINE" : "OFFLINE"}
            </Badge>

            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastPowerUpdate}
            </div>
          </div>
        </div>

        {/* Power Control (Technicians Only) */}
        {canEdit && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Electricity Control
            </div>
            <Button
              onClick={handlePowerToggle}
              disabled={isUpdating}
              variant={isOnline ? "destructive" : "default"}
              size="sm"
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <Power className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : isOnline ? (
                <>
                  <ZapOff className="w-4 h-4 mr-2" />
                  Mark as Power Outage
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Electricity Restored
                </>
              )}
            </Button>

            {!isOnline && (
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Machine is offline due to power outage. Click "Electricity
                  Restored" when power comes back.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Admin View (Read-only) */}
        {!canEdit && (
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Power className="w-3 h-3" />
              {isOnline
                ? "Machine has power and is operational"
                : "Machine is offline due to power outage"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
