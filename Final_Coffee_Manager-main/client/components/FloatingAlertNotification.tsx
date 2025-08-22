import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, Eye, Clock, CheckCircle, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
}

interface FloatingAlertNotificationProps {
  onViewAlerts: () => void;
}

const FloatingAlertNotification: React.FC<FloatingAlertNotificationProps> = ({
  onViewAlerts,
}) => {
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "critical",
      title: "Filter Replacement Critical",
      description: "Water filter needs immediate replacement",
      timestamp: "2 minutes ago",
      priority: "high",
    },
    {
      id: "2",
      type: "warning",
      title: "Low Coffee Beans",
      description: "Bean level below 15%",
      timestamp: "5 minutes ago",
      priority: "medium",
    },
  ]);

  const [isVisible, setIsVisible] = useState(true);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const activeAlerts = recentAlerts.filter(
    (alert) => !dismissed.includes(alert.id),
  );

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-50";
      case "warning":
        return "border-orange-500 bg-orange-50";
      case "info":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "info":
        return <Bell className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const dismissAlert = (alertId: string) => {
    setDismissed((prev) => [...prev, alertId]);
  };

  const viewAllAlerts = () => {
    onViewAlerts();
    setIsVisible(false);
  };

  if (activeAlerts.length === 0 || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <AnimatePresence>
        {activeAlerts.slice(0, 2).map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`mb-3 ${index > 0 ? "opacity-75" : ""}`}
          >
            <Card
              className={`border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 ${getAlertColor(alert.type)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <Badge
                      variant={
                        alert.priority === "high" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {alert.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-6 w-6 p-0 hover:bg-white/50"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {alert.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={viewAllAlerts}
                    className="h-6 text-xs px-2"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {activeAlerts.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={viewAllAlerts}
            className="bg-white/80 backdrop-blur-sm shadow-lg"
          >
            <Bell className="w-3 h-3 mr-2" />+{activeAlerts.length - 2} more
            alerts
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FloatingAlertNotification;
