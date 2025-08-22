import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  CheckCircle,
  Wrench,
  Droplets,
  Filter,
  Settings,
  Clock,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  urgent?: boolean;
}

const QuickActionFab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: "filter",
      title: "Replace Filter",
      description: "Mark filter as replaced",
      icon: <Filter className="w-4 h-4" />,
      color: "bg-red-500 hover:bg-red-600",
      action: () => {
        // Handle filter replacement
        console.log("Filter replaced");
        setIsOpen(false);
      },
      urgent: true,
    },
    {
      id: "refill",
      title: "Refill Supplies",
      description: "Mark supplies as refilled",
      icon: <Droplets className="w-4 h-4" />,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        // Handle supply refill
        console.log("Supplies refilled");
        setIsOpen(false);
      },
    },
    {
      id: "clean",
      title: "Complete Cleaning",
      description: "Mark cleaning as done",
      icon: <Settings className="w-4 h-4" />,
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        // Handle cleaning completion
        console.log("Cleaning completed");
        setIsOpen(false);
      },
    },
    {
      id: "maintenance",
      title: "Maintenance Done",
      description: "Complete maintenance task",
      icon: <Wrench className="w-4 h-4" />,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => {
        // Handle maintenance completion
        console.log("Maintenance completed");
        setIsOpen(false);
      },
    },
  ];

  const urgentActions = quickActions.filter((action) => action.urgent);

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <TooltipProvider>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="lg"
                      className="rounded-full w-14 h-14 bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Zap className="w-6 h-6" />
                    </Button>
                  </motion.div>
                  {urgentActions.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center animate-pulse"
                    >
                      {urgentActions.length}
                    </Badge>
                  )}
                </div>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Quick Actions</p>
            </TooltipContent>
          </Tooltip>

          <PopoverContent side="left" className="w-80 p-0 mr-4" sideOffset={8}>
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Quick Actions
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Quickly resolve common machine issues
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 hover:bg-muted/50"
                      onClick={action.action}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`p-2 rounded-full ${action.color} text-white`}
                        >
                          {action.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              {action.title}
                            </p>
                            {action.urgent && (
                              <Badge
                                variant="destructive"
                                className="text-xs px-1.5 py-0"
                              >
                                URGENT
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Button>
                  </motion.div>
                ))}

                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <Clock className="w-3 h-3 mr-2" />
                    View All Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    </div>
  );
};

export default QuickActionFab;
