import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Droplets,
  Wrench,
  User,
  Calendar,
  FileText,
  Save,
  X,
  Edit3,
  History,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  category: "maintenance" | "supply" | "cleaning" | "system";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "active" | "in_progress" | "resolved";
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  estimatedTime?: string;
  machineComponent?: string;
}

const AlertManagement: React.FC = () => {
  const { user } = useAuth();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: "",
    resolution: "",
    estimatedTime: "",
  });

  // Sample alerts - in real app, this would come from API
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "critical",
      category: "maintenance",
      title: "Filter Replacement Required",
      description:
        "Water filter has reached end of life and needs immediate replacement",
      priority: "high",
      status: "active",
      createdAt: "2024-01-15T10:30:00Z",
      machineComponent: "Water Filter",
    },
    {
      id: "2",
      type: "warning",
      category: "cleaning",
      title: "Deep Cleaning Overdue",
      description: "Machine hasn't been deep cleaned for 48 hours",
      priority: "medium",
      status: "in_progress",
      createdAt: "2024-01-14T14:20:00Z",
      machineComponent: "Brewing Unit",
    },
    {
      id: "3",
      type: "warning",
      category: "supply",
      title: "Low Coffee Beans",
      description: "Coffee bean level is below 20%",
      priority: "medium",
      status: "resolved",
      createdAt: "2024-01-13T09:15:00Z",
      resolvedAt: "2024-01-13T11:30:00Z",
      resolvedBy: "John Technician",
      resolution: "Refilled coffee bean hopper to 100%",
      machineComponent: "Bean Hopper",
    },
    {
      id: "4",
      type: "info",
      category: "system",
      title: "Scheduled Maintenance Due",
      description: "Monthly preventive maintenance is scheduled for tomorrow",
      priority: "low",
      status: "active",
      createdAt: "2024-01-12T08:00:00Z",
      estimatedTime: "2 hours",
      machineComponent: "Overall System",
    },
  ]);

  const getAlertIcon = (category: string) => {
    switch (category) {
      case "maintenance":
        return <Wrench className="w-4 h-4" />;
      case "supply":
        return <Droplets className="w-4 h-4" />;
      case "cleaning":
        return <Settings className="w-4 h-4" />;
      case "system":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: string, status: string) => {
    if (status === "resolved") return "bg-green-50 border-green-200";
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-orange-50 border-orange-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "destructive";
      case "in_progress":
        return "secondary";
      case "resolved":
        return "default";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-orange-600 bg-orange-100";
      case "low":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleEditAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setEditForm({
      status: alert.status,
      resolution: alert.resolution || "",
      estimatedTime: alert.estimatedTime || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveAlert = () => {
    if (!selectedAlert) return;

    const updatedAlerts = alerts.map((alert) => {
      if (alert.id === selectedAlert.id) {
        return {
          ...alert,
          status: editForm.status as Alert["status"],
          resolution: editForm.resolution,
          estimatedTime: editForm.estimatedTime,
          resolvedAt:
            editForm.status === "resolved"
              ? new Date().toISOString()
              : undefined,
          resolvedBy: editForm.status === "resolved" ? user?.name : undefined,
        };
      }
      return alert;
    });

    setAlerts(updatedAlerts);
    setIsEditDialogOpen(false);
    setSelectedAlert(null);
  };

  const activeAlerts = alerts.filter((alert) => alert.status === "active");
  const inProgressAlerts = alerts.filter(
    (alert) => alert.status === "in_progress",
  );
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved");

  const renderAlertCard = (alert: Alert) => (
    <Card
      key={alert.id}
      className={`transition-all duration-300 hover:shadow-lg ${getAlertColor(alert.type, alert.status)}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getAlertIcon(alert.category)}
            <CardTitle className="text-sm font-medium">{alert.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={getPriorityColor(alert.priority)}
            >
              {alert.priority.toUpperCase()}
            </Badge>
            <Badge variant={getStatusColor(alert.status)}>
              {alert.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{alert.description}</p>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(alert.createdAt)}</span>
          </div>
          {alert.machineComponent && (
            <div className="flex items-center gap-1">
              <Settings className="w-3 h-3" />
              <span>{alert.machineComponent}</span>
            </div>
          )}
        </div>

        {alert.status === "resolved" && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Resolved</span>
            </div>
            <p className="text-sm text-green-700">{alert.resolution}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-green-600">
              <span>By: {alert.resolvedBy}</span>
              <span>
                On: {alert.resolvedAt && formatDate(alert.resolvedAt)}
              </span>
            </div>
          </div>
        )}

        {user?.role === "technician" && alert.status !== "resolved" && (
          <Button
            onClick={() => handleEditAlert(alert)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Edit3 className="w-3 h-3 mr-2" />
            Update Alert
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">
                  Active Alerts
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {activeAlerts.length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {inProgressAlerts.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {resolvedAlerts.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Total Alerts
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {alerts.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Management Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Active ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            In Progress ({inProgressAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Resolved ({resolvedAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeAlerts.map(renderAlertCard)}
            {activeAlerts.length === 0 && (
              <Card className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Active Alerts</h3>
                <p className="text-muted-foreground">
                  All systems are running smoothly!
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-4">
            {inProgressAlerts.map(renderAlertCard)}
            {inProgressAlerts.length === 0 && (
              <Card className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Alerts in Progress</h3>
                <p className="text-muted-foreground">
                  Start working on active alerts to see them here.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <div className="grid gap-4">
            {resolvedAlerts.map(renderAlertCard)}
            {resolvedAlerts.length === 0 && (
              <Card className="p-8 text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Resolved Alerts</h3>
                <p className="text-muted-foreground">
                  Resolved alerts will appear here.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Alert Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Update Alert
            </DialogTitle>
            <DialogDescription>
              Update the status and add resolution details for this alert.
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium">{selectedAlert.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedAlert.description}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editForm.status !== "active" && (
                <div className="space-y-2">
                  <Label>Resolution Notes</Label>
                  <Textarea
                    value={editForm.resolution}
                    onChange={(e) =>
                      setEditForm({ ...editForm, resolution: e.target.value })
                    }
                    placeholder="Describe what action was taken or is being taken..."
                    rows={3}
                  />
                </div>
              )}

              {editForm.status === "in_progress" && (
                <div className="space-y-2">
                  <Label>Estimated Completion Time</Label>
                  <Input
                    value={editForm.estimatedTime}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        estimatedTime: e.target.value,
                      })
                    }
                    placeholder="e.g., 2 hours, 30 minutes"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveAlert}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlertManagement;
