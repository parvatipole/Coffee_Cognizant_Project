import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Coffee,
  Droplets,
  Milk,
  Candy,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Plus,
  RotateCcw,
  Zap,
  ZapOff,
  Activity,
  TrendingUp,
  Clock,
  RefreshCw,
  MapPin,
  Building,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import SupplyRefillModal from "@/components/SupplyRefillModal";
import UsageChart from "@/components/UsageChart";
import BrewTypeAnalytics from "@/components/BrewTypeAnalytics";
import InteractiveBreadcrumb from "@/components/InteractiveBreadcrumb";
import { pathToOfficeName, officeNameToPath } from "@/lib/officeRouting";
import { apiClient } from "@/lib/api";
import { dataManager } from "@/lib/dataManager";

interface MachineData {
  id: string;
  name: string;
  location: string;
  status: "operational" | "maintenance" | "offline";
  powerStatus: "online" | "offline";
  electricityStatus: "available" | "unavailable";
  lastPowerUpdate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  supplies: {
    water: number;
    milk: number;
    coffeeBeans: number;
    sugar: number;
  };
  maintenance: {
    filterStatus: "good" | "needs_replacement" | "critical";
    cleaningStatus: "clean" | "needs_cleaning" | "overdue";
    pressure: number;
  };
  usage: {
    dailyCups: number;
    weeklyCups: number;
  };
  notes: string;
  alerts?: any[];
  recentRefills?: any[];
}

interface MachineManagementProps {
  officePath?: string; // Optional for backward compatibility
}

export default function MachineManagement({
  officePath,
}: MachineManagementProps = {}) {
  const { user } = useAuth();
  const { machineId } = useParams<{ machineId?: string }>();
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingElectricity, setIsEditingElectricity] = useState(false);
  const [isLoadingMachine, setIsLoadingMachine] = useState(true);

  // Generate dynamic alerts based on machine condition
  const generateDynamicAlerts = (machine: MachineData): any[] => {
    const alerts: any[] = [];

    // Generate alerts for low supplies (< 20%)
    Object.entries(machine.supplies).forEach(([key, value]) => {
      if (value < 20) {
        const supplyNames = {
          water: 'Water Tank',
          milk: 'Milk Container',
          coffeeBeans: 'Coffee Beans',
          sugar: 'Sugar Container'
        };
        alerts.push({
          id: `supply-${key}-${Date.now()}`,
          type: 'warning',
          title: `${supplyNames[key as keyof typeof supplyNames]} Running Low`,
          description: `${value}% remaining - refill recommended`,
          category: 'supply',
          resolved: false,
          createdAt: new Date().toISOString()
        });
      }
    });

    // Electricity status alerts
    if (machine.electricityStatus === 'unavailable') {
      alerts.push({
        id: `electricity-${Date.now()}`,
        type: 'critical',
        title: 'Electricity Unavailable',
        description: 'Machine cannot operate without power supply',
        category: 'system',
        resolved: false,
        createdAt: new Date().toISOString()
      });
    }

    // Maintenance alerts
    if (machine.maintenance.filterStatus === 'needs_replacement') {
      alerts.push({
        id: `filter-${Date.now()}`,
        type: 'warning',
        title: 'Filter Replacement Required',
        description: 'Water filter needs replacement',
        category: 'maintenance',
        resolved: false,
        createdAt: new Date().toISOString()
      });
    }

    if (machine.maintenance.cleaningStatus === 'needs_cleaning') {
      alerts.push({
        id: `cleaning-${Date.now()}`,
        type: 'info',
        title: 'Cleaning Required',
        description: 'Machine needs scheduled cleaning',
        category: 'cleaning',
        resolved: false,
        createdAt: new Date().toISOString()
      });
    }

    return alerts;
  };

  // Get machine data by ID (searches localStorage first, then static data)
  const getMachineDataById = (id: string): MachineData | null => {
    // First check localStorage for updated data
    const localMachine = dataManager.getMachine(id);
    if (localMachine) {
      console.log('📦 Found machine in localStorage:', localMachine);
      return localMachine;
    }

    // Fallback to static data
    const allMachines = getAllMachinesData();
    return allMachines.find((m) => m.id === id) || null;
  };

  // Get all machines from all offices
  const getAllMachinesData = (): MachineData[] => {
    const allMachines: MachineData[] = [];
    Object.values(getOfficeMachinesData()).forEach((machines) => {
      if (Array.isArray(machines)) {
        allMachines.push(...machines);
      } else {
        allMachines.push(machines);
      }
    });
    return allMachines;
  };

  // Get all office machine data
  const getOfficeMachinesData = () => {
    return {
      "Hinjewadi IT Park": [
        {
          id: "HIJ-001",
          name: "Coffee Station Alpha",
          location: "Hinjewadi IT Park - Building A2",
          status: "operational" as const,
          powerStatus: "online" as const,
          electricityStatus: "available" as const,
          lastPowerUpdate: "2024-01-16 09:30",
          lastMaintenance: "2024-01-10",
          nextMaintenance: "2024-02-10",
          supplies: { water: 85, milk: 60, coffeeBeans: 75, sugar: 90 },
          maintenance: {
            filterStatus: "good" as const,
            cleaningStatus: "clean" as const,
            temperature: 92,
            pressure: 15,
          },
          usage: { dailyCups: 127, weeklyCups: 890 },
          notes:
            "Machine running smoothly. Recent cleaning completed on schedule.",
        },
        {
          id: "HIJ-002",
          name: "Espresso Hub Beta",
          location: "Hinjewadi IT Park - Building B1",
          status: "operational" as const,
          powerStatus: "online" as const,
          electricityStatus: "available" as const,
          lastPowerUpdate: "2024-01-16 08:45",
          lastMaintenance: "2024-01-12",
          nextMaintenance: "2024-02-12",
          supplies: { water: 92, milk: 45, coffeeBeans: 88, sugar: 76 },
          maintenance: {
            filterStatus: "good" as const,
            cleaningStatus: "clean" as const,
            temperature: 89,
            pressure: 14,
          },
          usage: { dailyCups: 98, weeklyCups: 686 },
          notes: "High performance. Minor calibration needed.",
        },
      ],
      "Koregaon Park Office": [
        {
          id: "KOR-001",
          name: "Executive Espresso",
          location: "Koregaon Park Office - Ground Floor",
          status: "operational" as const,
          powerStatus: "online" as const,
          electricityStatus: "available" as const,
          lastPowerUpdate: "2024-01-16 10:15",
          lastMaintenance: "2024-01-05",
          nextMaintenance: "2024-02-05",
          supplies: { water: 78, milk: 80, coffeeBeans: 65, sugar: 95 },
          maintenance: {
            filterStatus: "good" as const,
            cleaningStatus: "clean" as const,
            temperature: 88,
            pressure: 12,
          },
          usage: { dailyCups: 89, weeklyCups: 650 },
          notes: "Popular machine. Consistent performance.",
        },
      ],
    };
  };

  // Get office-specific machine data (legacy function)
  const getOfficeMachineData = () => {
    const officeMachines = {
      "Hinjewadi IT Park": {
        id: "HIJ-001",
        name: "Coffee Station Alpha",
        location: "Hinjewadi IT Park - Building A2",
        status: "operational" as const,
        powerStatus: "online" as const,
        lastPowerUpdate: "2024-01-16 09:30",
        lastMaintenance: "2024-01-10",
        nextMaintenance: "2024-02-10",
        supplies: { water: 85, milk: 60, coffeeBeans: 75, sugar: 90 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 92,
          pressure: 15,
        },
        usage: { dailyCups: 127, weeklyCups: 890 },
        notes:
          "Machine running smoothly. Recent cleaning completed on schedule.",
      },
      "Koregaon Park Corporate": {
        id: "KOR-001",
        name: "Espresso Pro",
        location: "Koregaon Park Corporate - Ground Floor",
        status: "maintenance" as const,
        powerStatus: "offline" as const,
        lastPowerUpdate: "2024-01-16 08:15",
        lastMaintenance: "2024-01-05",
        nextMaintenance: "2024-02-05",
        supplies: { water: 45, milk: 80, coffeeBeans: 30, sugar: 95 },
        maintenance: {
          filterStatus: "needs_replacement" as const,
          cleaningStatus: "needs_cleaning" as const,
          temperature: 88,
          pressure: 12,
        },
        usage: { dailyCups: 89, weeklyCups: 650 },
        notes: "Filter replacement scheduled for today.",
      },
      "Viman Nagar Tech Hub": {
        id: "VIM-001",
        name: "Latte Master",
        location: "Viman Nagar Tech Hub - 3rd Floor",
        status: "operational" as const,
        powerStatus: "online" as const,
        lastPowerUpdate: "2024-01-16 10:45",
        lastMaintenance: "2024-01-12",
        nextMaintenance: "2024-02-12",
        supplies: { water: 90, milk: 45, coffeeBeans: 85, sugar: 70 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 94,
          pressure: 16,
        },
        usage: { dailyCups: 156, weeklyCups: 1120 },
        notes: "High usage office. Consider additional machine.",
      },
      "Bandra Kurla Complex": {
        id: "BKC-001",
        name: "Cappuccino Deluxe",
        location: "Bandra Kurla Complex - 12th Floor",
        status: "operational" as const,
        powerStatus: "online" as const,
        lastPowerUpdate: "2024-01-16 11:20",
        lastMaintenance: "2024-01-08",
        nextMaintenance: "2024-02-08",
        supplies: { water: 70, milk: 85, coffeeBeans: 60, sugar: 80 },
        maintenance: {
          filterStatus: "good" as const,
          cleaningStatus: "clean" as const,
          temperature: 91,
          pressure: 14,
        },
        usage: { dailyCups: 98, weeklyCups: 720 },
        notes: "New installation. Performing well.",
      },
      "Andheri Tech Center": {
        id: "AND-001",
        name: "Premium Coffee Station",
        location: "Andheri Tech Center - 8th Floor",
        status: "operational" as const,
        powerStatus: "online" as const,
        lastPowerUpdate: "2024-01-16 09:00",
        lastMaintenance: "2024-01-15",
        nextMaintenance: "2024-02-15",
        supplies: { water: 95, milk: 70, coffeeBeans: 80, sugar: 85 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 90,
          pressure: 13,
        },
        usage: { dailyCups: 110, weeklyCups: 770 },
        notes: "Excellent performance. Regular maintenance on track.",
      },
      "Lower Parel Financial": {
        id: "LOW-001",
        name: "Business Brew",
        location: "Lower Parel Financial - Tower B",
        status: "operational" as const,
        powerStatus: "online" as const,
        lastPowerUpdate: "2024-01-16 07:45",
        lastMaintenance: "2024-01-14",
        nextMaintenance: "2024-02-14",
        supplies: { water: 88, milk: 65, coffeeBeans: 72, sugar: 92 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 93,
          pressure: 15,
        },
        usage: { dailyCups: 134, weeklyCups: 945 },
        notes: "Busy financial district environment. Machine handling well.",
      },
    };

    // Determine which office to show
    let targetOffice: string;

    if (officePath) {
      // Convert path back to office name using proper mapping
      targetOffice = pathToOfficeName(officePath);
    } else if (user?.officeName) {
      targetOffice = user.officeName;
    } else {
      // Default fallback
      targetOffice = "Hinjewadi IT Park";
    }

    const machineData =
      officeMachines[targetOffice as keyof typeof officeMachines] ||
      officeMachines["Hinjewadi IT Park"];

    // Add default power status and electricity status if not present (for backward compatibility)
    const result = machineData as any;
    if (!result.powerStatus) {
      result.powerStatus = result.status === "offline" ? "offline" : "online";
      result.lastPowerUpdate = "2024-01-16 10:00";
    }
    if (!result.electricityStatus) {
      result.electricityStatus = "available";
    }
    if (!result.recentRefills) {
      result.recentRefills = [];
    }

    return result as MachineData;
  };

  const [machineData, setMachineData] = useState<MachineData | null>(null);

  // Load machine data from dataManager (shared storage first, then fallback)
  useEffect(() => {
    const loadMachineData = async () => {
      setIsLoadingMachine(true);

      if (!machineId) {
        // Legacy behavior for when no machineId is provided
        const officeData = getOfficeMachineData();
        setMachineData(officeData);
        setIsLoadingMachine(false);
        return;
      }

      try {
        // PRIORITY 1: Check shared storage (includes all technician updates)
        let machineData = dataManager.getMachine(machineId);

        if (machineData) {
          console.log('✅ MACHINE DETAIL: Loaded machine from storage:', machineData.id, 'status:', machineData.status);
        } else {
          // PRIORITY 2: Try to load from API (for new machines not yet in storage)
          try {
            const apiData = await apiClient.getMachineByMachineId(machineId);
            if (apiData) {
              machineData = dataManager.mapBackendToFrontend(apiData);
              console.log('📡 MACHINE DETAIL: Loaded machine from API:', machineData);
              // Save to storage for future consistency
              dataManager.saveMachine(machineData);
            }
          } catch (apiError) {
            console.log('API unavailable, trying static fallback:', apiError.message);
          }

          // PRIORITY 3: Fallback to static data (only if nothing else works)
          if (!machineData) {
            machineData = getMachineDataById(machineId);
            if (machineData) {
              console.log('💾 MACHINE DETAIL: Using static fallback data for:', machineId);
              // Save static data to storage for future consistency
              dataManager.saveMachine(machineData);
            }
          }
        }

        if (machineData) {
          setMachineData(machineData);
          // Generate dynamic alerts based on machine condition
          const dynamicAlerts = generateDynamicAlerts(machineData);
          const existingAlerts = machineData.alerts || [];
          const mergedAlerts = [...existingAlerts, ...dynamicAlerts];
          setAlerts(mergedAlerts);
        } else {
          console.error('MACHINE DETAIL: Could not load machine data for:', machineId);
        }
      } catch (error) {
        console.error("MACHINE DETAIL: Failed to load machine data:", error);
      } finally {
        setIsLoadingMachine(false);
      }
    };

    loadMachineData();

    // Listen for storage changes to detect updates from other tabs/users
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'coffee_shared_machines' && e.newValue !== e.oldValue) {
        console.log('🔄 MACHINE DETAIL: Detected storage change, reloading machine data...');
        loadMachineData();
      }
    };

    const handleMachineDataChanged = (e: CustomEvent) => {
      // Check if this machine was updated
      if (e.detail?.machine?.id === machineId || e.detail?.machine?.machineId === machineId) {
        console.log('🔄 MACHINE DETAIL: Machine data changed event received, reloading...');
        loadMachineData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('machineDataChanged', handleMachineDataChanged as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('machineDataChanged', handleMachineDataChanged as EventListener);
    };
  }, [machineId]);

  const canEdit = user?.role === "technician";

  // Alert management state - initialized empty, populated after data loads
  const [alerts, setAlerts] = useState<any[]>([]);

  // Update alerts when machine data changes
  useEffect(() => {
    if (!machineData) return;

    const dynamicAlerts = generateDynamicAlerts(machineData);
    const existingResolvedAlerts = alerts.filter(alert => alert.resolved);
    setAlerts([...existingResolvedAlerts, ...dynamicAlerts]);
  }, [machineData?.supplies, machineData?.electricityStatus, machineData?.maintenance]);

  // Handle alert resolution
  const handleAlertResolution = async (alertId: string) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId
        ? {
            ...alert,
            resolved: true,
            resolvedBy: user?.name || "Technician",
            resolvedAt: "Just now",
          }
        : alert,
    );

    // Update local state immediately
    setAlerts(updatedAlerts);

    // Update machine data to include resolved alerts
    const updatedMachineData = {
      ...machineData,
      alerts: updatedAlerts,
    };
    setMachineData(updatedMachineData);

    try {
      // Save to backend
      await apiClient.updateMachine(machineData.id, updatedMachineData);
    } catch (error) {
      console.error("Failed to resolve alert:", error);
      // Could revert local state and show error toast
    }
  };

  const supplies = machineData ? [
    {
      name: "Water",
      key: "water",
      current: machineData.supplies.water,
      icon: <Droplets className="w-4 h-4" />,
      unit: "L",
      cost: 25,
    },
    {
      name: "Milk",
      key: "milk",
      current: machineData.supplies.milk,
      icon: <Milk className="w-4 h-4" />,
      unit: "L",
      cost: 45,
    },
    {
      name: "Coffee Beans",
      key: "coffeeBeans",
      current: machineData.supplies.coffeeBeans || machineData.supplies.coffee || 0,
      icon: <Coffee className="w-4 h-4" />,
      unit: "kg",
      cost: 120,
    },
    {
      name: "Sugar",
      key: "sugar",
      current: machineData.supplies.sugar,
      icon: <Candy className="w-4 h-4" />,
      unit: "kg",
      cost: 30,
    },
  ] : [];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Ensure office field is present before saving
      const dataToSave = {
        ...machineData,
        office: machineData.office || user?.officeName || "Unknown Office"
      };

      // Save to localStorage immediately for offline support
      dataManager.saveMachine(dataToSave);

      // Try to save to backend
      try {
        const backendData = dataManager.mapFrontendToBackend(machineData);
        await apiClient.updateMachine(machineData.id, backendData);
        console.log('Machine data saved to backend successfully');
      } catch (apiError) {
        console.log('Backend unavailable, saved locally only:', apiError.message);
      }

      // Changes saved successfully
    } catch (error) {
      console.error("Failed to save machine data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleElectricityStatusChange = async (newElectricityStatus: "available" | "unavailable") => {
    if (!canEdit) return;

    // Determine new machine status based on electricity
    let newStatus = machineData.status;
    let newPowerStatus = machineData.powerStatus;

    if (newElectricityStatus === "unavailable") {
      newStatus = "offline";
      newPowerStatus = "offline";
    } else if (newElectricityStatus === "available" && machineData.status === "offline") {
      newStatus = "operational";
      newPowerStatus = "online";
    }

    const updatedData = {
      ...machineData,
      electricityStatus: newElectricityStatus,
      status: newStatus,
      powerStatus: newPowerStatus,
      office: machineData.office || user?.officeName || "Unknown Office", // Ensure office field exists
      lastPowerUpdate: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    // Update local state immediately
    setMachineData(updatedData);

    // Save to localStorage immediately - THIS CHANGE IS PERMANENT
    dataManager.saveMachine(updatedData);
    console.log(`🔒 PERMANENT CHANGE: Machine ${machineData.id} electricity status changed to "${newElectricityStatus}" (machine status: "${newStatus}") - Admin will see this!`);

    try {
      // Save to backend
      const backendData = dataManager.mapFrontendToBackend(updatedData);
      await apiClient.updateMachine(machineData.id, backendData);
      console.log('Electricity status updated in backend successfully');
    } catch (error) {
      console.log('Backend unavailable, saved electricity status locally:', error.message);
    }

    setIsEditingElectricity(false);
  };

  const handleSupplyRefill = async (supplyKey: string, amount: number) => {
    const currentValue = machineData.supplies[supplyKey as keyof typeof machineData.supplies] || 0;
    const newValue = Math.min(100, currentValue + amount);

    const updatedSupplies = {
      ...machineData.supplies,
      [supplyKey]: newValue,
    };

    // Ensure backend key `coffee` stays in sync when updating coffeeBeans
    if (supplyKey === 'coffeeBeans') {
      updatedSupplies.coffee = newValue;
    }

    console.log(`🔄 Refilling ${supplyKey}: ${currentValue}% → ${newValue}%`);

    // Add to recent refills
    const supplyNames = {
      water: 'Water Tank',
      milk: 'Milk Container',
      coffeeBeans: 'Coffee Beans',
      sugar: 'Sugar Container'
    };

    const newRefill = {
      id: `refill-${supplyKey}-${Date.now()}`,
      supplyType: supplyKey,
      supplyName: supplyNames[supplyKey as keyof typeof supplyNames],
      amount: newValue,
      refillAmount: amount,
      timestamp: new Date().toISOString(),
      technician: user?.name || 'Technician',
      timeAgo: 'Just now'
    };

    const updatedRefills = [newRefill, ...(machineData.recentRefills || [])].slice(0, 10); // Keep last 10 refills

    // Create updated machine data
    const updatedMachineData = {
      ...machineData,
      supplies: updatedSupplies,
      recentRefills: updatedRefills,
      office: machineData.office || user?.officeName || "Unknown Office", // Ensure office field exists
    };

    // Update local state immediately for responsive UI
    setMachineData(updatedMachineData);

    // Save entire machine to localStorage to ensure persistence
    dataManager.saveMachine(updatedMachineData);
    console.log('💾 Saved updated machine to localStorage');

    try {
      // Save to backend using backend supply keys
      const backendSupplies = dataManager.mapFrontendToBackend({ supplies: updatedSupplies }).supplies;
      await apiClient.updateSupplies(machineData.id, {
        supplies: backendSupplies,
      });
      console.log('📡 Supplies updated in backend successfully');
    } catch (error) {
      console.log('���️ Backend unavailable, saved supplies locally only:', (error as any).message);
    }
  };

  const openRefillModal = (supply: any) => {
    if (!canEdit) return;
    setSelectedSupply(supply);
    setRefillModalOpen(true);
  };

  const handlePowerStatusChange = async (newStatus: "online" | "offline") => {
    if (!canEdit) return;

    const updatedData = {
      ...machineData,
      powerStatus: newStatus,
      office: machineData.office || user?.officeName || "Unknown Office", // Ensure office field exists
      lastPowerUpdate: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      // Also update machine status if power goes offline
      status:
        newStatus === "offline"
          ? "offline"
          : machineData.status === "offline"
            ? "operational"
            : machineData.status,
    };

    // Update local state immediately
    setMachineData(updatedData);

    // Save to localStorage immediately - THIS CHANGE IS PERMANENT
    dataManager.saveMachine(updatedData);
    console.log(`🔒 PERMANENT CHANGE: Machine ${machineData.id} power status changed to "${newStatus}" - Admin will see this!`);

    try {
      // Save to backend
      const backendData = dataManager.mapFrontendToBackend(updatedData);
      await apiClient.updateMachine(machineData.id, backendData);
      console.log('Power status updated in backend successfully');
    } catch (error) {
      console.log('Backend unavailable, saved power status locally:', error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "maintenance":
        return "bg-orange-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSupplyColor = (percentage: number) => {
    if (percentage > 60) return "text-green-600";
    if (percentage > 30) return "text-orange-500";
    return "text-red-500";
  };

  const getSupplyIcon = (percentage: number) => {
    if (percentage > 60)
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (percentage > 30)
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  // Animate progress bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger rerender to animate progress bars
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while machine data is being loaded
  if (isLoadingMachine || !machineData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-light/30 to-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Loading machine data...</p>
          <p className="text-sm text-muted-foreground">Please wait while we fetch the latest information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-light/30 to-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InteractiveBreadcrumb
              backUrl={
                user?.role === "technician"
                  ? (machineId && user?.officeName
                      ? `/office/${officeNameToPath(user.officeName)}`
                      : "/dashboard")
                  : (machineData.office || officePath)
                      ? `/office/${officeNameToPath(machineData.office || pathToOfficeName(officePath || ""))}`
                      : "/dashboard" // Fallback if no office info available
              }
              className="flex-1"
            />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-coffee-brown">
              {officePath
                ? `${pathToOfficeName(officePath)} - Coffee Machines`
                : "Machine Management"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {(user?.officeName || officePath) && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 animate-fadeIn">
                  <Building className="w-3 h-3" />
                  {officePath ? pathToOfficeName(officePath) : user?.officeName}
                </Badge>
                {user?.city && (
                  <Badge variant="secondary" className="gap-1 animate-fadeIn">
                    <MapPin className="w-3 h-3" />
                    {user.city.charAt(0).toUpperCase() + user.city.slice(1)}
                  </Badge>
                )}
              </div>
            )}
            <Badge
              variant={user?.role === "technician" ? "default" : "secondary"}
              className="gap-1 animate-fadeIn"
            >
              {user?.role === "technician" ? (
                <Edit3 className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
              {user?.role === "technician" ? "Edit Mode" : "View Only"}
            </Badge>
            {canEdit && (
              <Button
                onClick={handleSave}
                variant="default"
                disabled={isLoading}
                className="hover:scale-105 transition-transform"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Machine Overview */}
          <Card className="animate-fadeIn">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="w-5 h-5" />
                    {machineData.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {machineData.location}
                  </CardDescription>
                  {user?.role === "technician" && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Assigned to: {user.name}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Machine Status & Electricity Management */}
          <Card className="animate-fadeIn" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Machine Status & Power Management
              </CardTitle>
              <CardDescription>
                Current operational status and electricity management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Machine Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Machine Status</Label>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(machineData.status)}`} />
                    <span className="capitalize text-sm font-medium">
                      {machineData.status === "offline" && machineData.electricityStatus === "unavailable"
                        ? "Not Functional (No Electricity)"
                        : machineData.status === "offline"
                        ? "Not Functional"
                        : machineData.status}
                    </span>
                  </div>
                </div>

                {/* Electricity Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Electricity Status</Label>
                  <div className="flex items-center gap-2">
                    {machineData.electricityStatus === "available" ? (
                      <Zap className="w-4 h-4 text-green-600" />
                    ) : (
                      <ZapOff className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      machineData.electricityStatus === "available" ? "text-green-600" : "text-red-600"
                    }`}>
                      {machineData.electricityStatus === "available" ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Technician Controls */}
                {canEdit && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Technician Controls</Label>
                    <div className="flex gap-2">
                      {!isEditingElectricity ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingElectricity(true)}
                          className="text-xs"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit Status
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={machineData.electricityStatus === "available" ? "destructive" : "default"}
                            onClick={() => handleElectricityStatusChange(
                              machineData.electricityStatus === "available" ? "unavailable" : "available"
                            )}
                            className="text-xs"
                          >
                            {machineData.electricityStatus === "available" ? (
                              <>
                                <ZapOff className="w-3 h-3 mr-1" />
                                Set Offline
                              </>
                            ) : (
                              <>
                                <Zap className="w-3 h-3 mr-1" />
                                Set Online
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditingElectricity(false)}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Last Update Info */}
              <div className="mt-4 pt-4 border-t">
                <div className="text-xs text-muted-foreground">
                  Last power update: {machineData.lastPowerUpdate || "Unknown"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="supplies" className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Supplies
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
              </div>



              {/* Alerts & Issues Section */}
              <Card
                className="animate-fadeIn"
                style={{ animationDelay: "300ms" }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Machine Alerts & Issues
                  </CardTitle>
                  <CardDescription>
                    Monitor and resolve machine issues (
                    {alerts.filter((a) => !a.resolved).length} active)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => {
                      const getAlertColor = (
                        type: string,
                        resolved: boolean,
                      ) => {
                        if (resolved) return "border-green-200 bg-green-50";
                        switch (type) {
                          case "critical":
                            return "border-red-200 bg-red-50";
                          case "warning":
                            return "border-orange-200 bg-orange-50";
                          case "info":
                            return "border-blue-200 bg-blue-50";
                          default:
                            return "border-gray-200 bg-gray-50";
                        }
                      };

                      const getAlertIcon = (
                        type: string,
                        resolved: boolean,
                      ) => {
                        if (resolved)
                          return (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          );
                        switch (type) {
                          case "critical":
                            return (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            );
                          case "warning":
                            return (
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                            );
                          case "info":
                            return <Clock className="h-4 w-4 text-blue-600" />;
                          default:
                            return (
                              <AlertTriangle className="h-4 w-4 text-gray-600" />
                            );
                        }
                      };

                      const getAlertPrefix = (
                        type: string,
                        resolved: boolean,
                      ) => {
                        if (resolved) return "Resolved:";
                        switch (type) {
                          case "critical":
                            return "Critical:";
                          case "warning":
                            return "Warning:";
                          case "info":
                            return "Info:";
                          default:
                            return "Alert:";
                        }
                      };

                      return (
                        <Alert
                          key={alert.id}
                          className={getAlertColor(alert.type, alert.resolved)}
                        >
                          {getAlertIcon(alert.type, alert.resolved)}
                          <AlertDescription>
                            <div className="flex items-center justify-between">
                              <div>
                                <strong>
                                  {getAlertPrefix(alert.type, alert.resolved)}
                                </strong>{" "}
                                {alert.title} - {alert.description}
                                {alert.resolved && alert.resolvedBy && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Resolved by {alert.resolvedBy} (
                                    {alert.resolvedAt})
                                  </div>
                                )}
                              </div>
                              {canEdit && !alert.resolved && (
                                <div className="flex items-center gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleAlertResolution(alert.id)
                                    }
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Mark Resolved
                                  </Button>
                                </div>
                              )}
                              {alert.resolved && (
                                <Badge
                                  variant="default"
                                  className="bg-green-100 text-green-800"
                                >
                                  ✓ Resolved
                                </Badge>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      );
                    })}

                    {alerts.filter((a) => !a.resolved).length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">All Clear!</h3>
                        <p className="text-muted-foreground">
                          No active alerts for this machine.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Machine Notes Section for Technicians */}
              {canEdit && (
                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "500ms" }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      Technician Notes
                    </CardTitle>
                    <CardDescription>
                      Add maintenance notes, observations, or reminders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        value={machineData.notes}
                        onChange={(e) =>
                          setMachineData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Add maintenance notes, observations, or reminders..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Supplies Tab */}
            <TabsContent value="supplies" className="space-y-6">
              {/* Supply Level Overview */}
              <Card className="animate-fadeIn">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    Supply Status Overview
                  </CardTitle>
                  <CardDescription>
                    Current supply levels and consumption trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {supplies.map((supply, index) => (
                      <div key={supply.key} className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          {supply.icon}
                        </div>
                        <Progress value={supply.current} className="mb-2" />
                        <div className="text-sm font-medium">
                          {supply.current}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {supply.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Supply Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {supplies.map((supply, index) => (
                  <Card
                    key={supply.key}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      canEdit ? "hover:border-primary" : ""
                    } animate-fadeIn`}
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={() => openRefillModal(supply)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          {supply.icon}
                          {supply.name}
                        </div>
                        {getSupplyIcon(supply.current)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${getSupplyColor(supply.current)}`}
                        >
                          {supply.current}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Current Level
                        </p>
                      </div>

                      <Progress
                        value={supply.current}
                        className="h-3 transition-all duration-1000 ease-out"
                      />

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Empty</span>
                        <span>Full</span>
                      </div>

                      {canEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full group hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          Refill
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Refills */}
              <Card
                className="animate-fadeIn"
                style={{ animationDelay: "400ms" }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Recent Refills
                  </CardTitle>
                  <CardDescription>
                    {machineData.recentRefills?.length || 0} refill{(machineData.recentRefills?.length || 0) !== 1 ? 's' : ''} recorded
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {machineData.recentRefills && machineData.recentRefills.length > 0 ? (
                      machineData.recentRefills.map((refill, index) => {
                        const formatTimeAgo = (timestamp: string) => {
                          const now = new Date();
                          const refillTime = new Date(timestamp);
                          const diffMs = now.getTime() - refillTime.getTime();
                          const diffMins = Math.floor(diffMs / (1000 * 60));
                          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                          if (diffMins < 1) return 'Just now';
                          if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
                          if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                          return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
                        };

                        const getBgColor = (supplyType: string) => {
                          switch (supplyType) {
                            case 'water': return 'bg-blue-50 border-blue-200';
                            case 'milk': return 'bg-purple-50 border-purple-200';
                            case 'coffeeBeans': return 'bg-amber-50 border-amber-200';
                            case 'sugar': return 'bg-pink-50 border-pink-200';
                            default: return 'bg-gray-50 border-gray-200';
                          }
                        };

                        return (
                          <div
                            key={refill.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${getBgColor(refill.supplyType)}`}
                          >
                            <div>
                              <div className="font-medium text-sm">{refill.supplyName}</div>
                              <div className="text-xs text-muted-foreground">
                                Refilled to {refill.amount}% (+{refill.refillAmount}%)
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-medium">{formatTimeAgo(refill.timestamp)}</div>
                              <div className="text-xs text-muted-foreground">
                                by {refill.technician}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Recent Refills</h3>
                        <p className="text-muted-foreground">
                          Refill activities will appear here after supplies are refilled.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <UsageChart />

              {/* Brew Type Analytics */}
              <BrewTypeAnalytics machineId={machineData.id} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "200ms" }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Peak Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">8-9 AM</span>
                        <Badge variant="outline">52 cups</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">1-2 PM</span>
                        <Badge variant="outline">48 cups</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">3-4 PM</span>
                        <Badge variant="outline">35 cups</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Supply Refill Modal */}
      {selectedSupply && (
        <SupplyRefillModal
          isOpen={refillModalOpen}
          onClose={() => {
            setRefillModalOpen(false);
            setSelectedSupply(null);
          }}
          supply={selectedSupply}
          onRefill={(amount) => handleSupplyRefill(selectedSupply.key, amount)}
          canEdit={canEdit}
        />
      )}
    </div>
  );
}
