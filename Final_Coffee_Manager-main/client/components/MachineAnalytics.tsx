import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Coffee,
  Gauge,
  Zap,
} from "lucide-react";

interface MachineAnalyticsProps {
  machineId: string;
  machineName: string;
  className?: string;
}

export default function MachineAnalytics({
  machineId,
  machineName,
  className,
}: MachineAnalyticsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* System Health - Simplified without temperature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pressure */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <Gauge className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">15.2 bar</div>
              <div className="text-sm text-muted-foreground">Pressure</div>
            </div>

            {/* Power */}
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">85%</div>
              <div className="text-sm text-muted-foreground">Power</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simple Usage Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Usage Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">147</div>
              <div className="text-sm text-muted-foreground">Cups Today</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,023</div>
              <div className="text-sm text-muted-foreground">Cups This Week</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">4,356</div>
              <div className="text-sm text-muted-foreground">Cups This Month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
