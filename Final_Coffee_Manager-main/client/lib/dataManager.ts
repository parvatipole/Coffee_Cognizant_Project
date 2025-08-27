// Data persistence management for coffee machines
// Handles localStorage persistence and data synchronization

import { STORAGE_KEYS, SUPPLY_TYPES } from "@/config";

interface MachineData {
  id: string;
  machineId?: string;
  name: string;
  location: string;
  office: string;
  floor?: string;
  status: 'operational' | 'maintenance' | 'offline';
  powerStatus: 'online' | 'offline';
  electricityStatus: 'available' | 'unavailable';
  lastPowerUpdate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  supplies: {
    water: number;
    milk: number;
    coffee: number;
    coffeeBeans: number;
    sugar: number;
  };
  maintenance: {
    filterStatus: 'good' | 'needs_replacement' | 'critical';
    cleaningStatus: 'clean' | 'needs_cleaning' | 'overdue';
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

// Note: STORAGE_KEYS now imported from configuration

// Normalize supplies to ensure both coffeeBeans (UI) and coffee (backend) are in sync
const normalizeSupplies = (supplies: any) => {
  const coffeeBeans = supplies?.coffeeBeans ?? supplies?.coffee ?? 0;
  return {
    [SUPPLY_TYPES.WATER]: supplies?.[SUPPLY_TYPES.WATER] ?? 0,
    [SUPPLY_TYPES.MILK]: supplies?.[SUPPLY_TYPES.MILK] ?? 0,
    [SUPPLY_TYPES.SUGAR]: supplies?.[SUPPLY_TYPES.SUGAR] ?? 0,
    [SUPPLY_TYPES.COFFEE_BEANS]: coffeeBeans,
    [SUPPLY_TYPES.COFFEE]: coffeeBeans,
  } as any;
};

const normalizeMachine = (machine: any) => {
  if (!machine) return machine;
  return {
    ...machine,
    supplies: normalizeSupplies(machine.supplies || {}),
  };
};

// Add global debug function
if (typeof window !== 'undefined') {
  (window as any).debugCoffeeMachines = () => {
    const dm = dataManager;
    dm.debugStorageState();
    return {
      local: dm.getAllMachines(),
      shared: dm.getAllMachinesFromSharedStorage(),
      refresh: dm.refreshSharedStorage
    };
  };
  console.log('🔧 DEBUG: Use window.debugCoffeeMachines() to debug storage state');

  // Persistence test utilities available via persistenceTest module
  console.log('🧪 TESTING: Persistence test utilities available');
}

export const dataManager = {
  // Save machine data to localStorage and shared storage for cross-user visibility
  saveMachine: (machine: MachineData): void => {
    const existingMachines = dataManager.getAllMachines();
    // Filter out any existing machine that matches either id or machineId to prevent duplicates
    const updatedMachines = existingMachines.filter(m => {
      const matchesId = m.id === machine.id;
      const matchesMachineId = machine.machineId && m.machineId === machine.machineId;
      return !matchesId && !matchesMachineId;
    });

    // Ensure normalized supplies before saving
    const normalized = normalizeMachine(machine);
    updatedMachines.push(normalized);

    console.log(`💾 DataManager: Saving machine ${machine.id}${machine.machineId ? ` (${machine.machineId})` : ''} to localStorage and shared storage`);

    // Save to local storage (for user-specific data)
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(updatedMachines));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

    // Also save to shared storage for cross-user visibility (simulates backend database)
    dataManager.syncToSharedStorage(normalized);
  },

  // Get all machines from localStorage
  getAllMachines: (): MachineData[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MACHINES);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeMachine) : [];
    } catch (error) {
      console.warn('Failed to load machines from localStorage:', error);
      return [];
    }
  },

  // Get machine by ID (shared storage is the authoritative source)
  getMachine: (id: string): MachineData | null => {
    // ALWAYS check shared storage first - this is the authoritative source for all updates
    const sharedMachine = dataManager.getMachineFromSharedStorage(id);
    if (sharedMachine) {
      console.log(`✅ DataManager: Found machine "${id}" in shared storage - status: ${sharedMachine.status}`);
      return sharedMachine;
    }

    // If not in shared storage, check local storage (rare case)
    const machines = dataManager.getAllMachines();
    const localMachine = machines.find(m => m.id === id || m.machineId === id);
    if (localMachine) {
      const normalized = normalizeMachine(localMachine);
      console.log(`📋 DataManager: Found machine "${id}" in local storage, will sync to shared storage`);
      // Immediately sync to shared storage to maintain consistency
      dataManager.syncToSharedStorage(normalized);
      return normalized;
    }

    console.log(`❌ DataManager: Machine "${id}" not found in any storage`);
    return null;
  },

  // Update machine supplies
  updateMachineSupplies: (id: string, supplies: Partial<MachineData['supplies']>): void => {
    const machines = dataManager.getAllMachines();
    const machineIndex = machines.findIndex(m => m.id === id || m.machineId === id);

    if (machineIndex !== -1) {
      const mergedSupplies = normalizeSupplies({
        ...machines[machineIndex].supplies,
        ...supplies,
      });
      machines[machineIndex].supplies = mergedSupplies as any;
      localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));

      // Also sync to shared storage for cross-user visibility
      dataManager.syncToSharedStorage(machines[machineIndex]);
      console.log(`🔄 SUPPLY REFILL: Machine ${id} supplies synced to shared storage`);
    }
  },

  // Update entire machine
  updateMachine: (id: string, updates: Partial<MachineData>): void => {
    const machines = dataManager.getAllMachines();
    const machineIndex = machines.findIndex(m => m.id === id || m.machineId === id);

    if (machineIndex !== -1) {
      const updated = normalizeMachine({
        ...machines[machineIndex],
        ...updates,
      });
      machines[machineIndex] = updated;
      localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));

      // Also sync to shared storage for cross-user visibility (so admin sees changes)
      dataManager.syncToSharedStorage(updated);
      console.log(`🔄 MACHINE UPDATE: Updated machine ${id} synced to shared storage`);
    }
  },

  // Remove machine
  removeMachine: (id: string): void => {
    const machines = dataManager.getAllMachines();
    const filteredMachines = machines.filter(m => m.id !== id && m.machineId !== id);
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(filteredMachines));

    // Also remove from shared storage for cross-user visibility
    const sharedMachines = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHARED_MACHINES) || '[]');
    const filteredSharedMachines = sharedMachines.filter((m: any) => m.id !== id && m.machineId !== id);
    localStorage.setItem(STORAGE_KEYS.SHARED_MACHINES, JSON.stringify(filteredSharedMachines));
  },

  // Clear all data
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.MACHINES);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
  },

  // Get last sync time
  getLastSync: (): Date | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return stored ? new Date(stored) : null;
  },

  // Map backend data format to frontend format
  mapBackendToFrontend: (backendData: any): MachineData => {
    const normalizedSupplies = normalizeSupplies(backendData.supplies || {});
    return {
      ...backendData,
      supplies: normalizedSupplies,
      // Ensure new fields have defaults
      electricityStatus: backendData.electricityStatus || 'available',
      recentRefills: backendData.recentRefills || [],
      alerts: backendData.alerts || [],
    };
  },

  // Map frontend data format to backend format
  mapFrontendToBackend: (frontendData: any): any => {
    const supplies = normalizeSupplies(frontendData.supplies || {});
    return {
      ...frontendData,
      supplies: {
        [SUPPLY_TYPES.WATER]: supplies[SUPPLY_TYPES.WATER],
        [SUPPLY_TYPES.MILK]: supplies[SUPPLY_TYPES.MILK],
        [SUPPLY_TYPES.SUGAR]: supplies[SUPPLY_TYPES.SUGAR],
        [SUPPLY_TYPES.COFFEE]: supplies[SUPPLY_TYPES.COFFEE], // backend expects `coffee`
      },
      // Ensure new fields are included
      electricityStatus: frontendData.electricityStatus || 'available',
      recentRefills: frontendData.recentRefills || [],
      alerts: frontendData.alerts || [],
    };
  },

  // Sync machine data to shared storage for cross-user visibility
  syncToSharedStorage: (machine: MachineData): void => {
    try {
      // Get existing shared machines
      const stored = localStorage.getItem(STORAGE_KEYS.SHARED_MACHINES);
      let sharedMachines = stored ? JSON.parse(stored) : [];

      // Ensure sharedMachines is an array
      if (!Array.isArray(sharedMachines)) {
        sharedMachines = [];
      }

      // Filter out existing machine by both id and machineId
      const beforeCount = sharedMachines.length;
      sharedMachines = sharedMachines.filter((m: any) => {
        const matchesId = m.id === machine.id;
        const matchesMachineId = machine.machineId && m.machineId === machine.machineId;
        return !matchesId && !matchesMachineId;
      });
      const afterCount = sharedMachines.length;

      // Add the updated machine with timestamp
      const machineWithTimestamp = {
        ...machine,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'technician', // Track who made the change
      };
      sharedMachines.push(machineWithTimestamp);

      // Save back to shared storage
      localStorage.setItem(STORAGE_KEYS.SHARED_MACHINES, JSON.stringify(sharedMachines));

      // Enhanced logging
      const action = beforeCount === afterCount ? 'ADDED' : 'UPDATED';
      console.log(`🔄 TECHNICIAN UPDATE: ${action} machine ${machine.id} (status: ${machine.status}) to shared storage - Admin will see this change!`);
      console.log(`📊 Storage stats: ${beforeCount} -> ${sharedMachines.length} machines in shared storage`);

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('machineDataChanged', {
        detail: { machine: machineWithTimestamp, action }
      }));
    } catch (error) {
      console.warn('Failed to sync machine to shared storage:', error);
    }
  },

  // Get machine from shared storage (for admins to see technician updates)
  getMachineFromSharedStorage: (id: string): MachineData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SHARED_MACHINES);
      if (!stored) return null;

      const sharedMachines = JSON.parse(stored);
      if (!Array.isArray(sharedMachines)) return null;

      const found = sharedMachines.find((m: any) => m.id === id || m.machineId === id);
      return found ? normalizeMachine(found) : null;
    } catch (error) {
      console.warn('Failed to get machine from shared storage:', error);
      return null;
    }
  },

  // Get all machines from shared storage
  getAllMachinesFromSharedStorage: (): MachineData[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SHARED_MACHINES);
      if (!stored) {
        // Initialize with demo data if shared storage is empty
        console.log('📦 FIRST TIME: Initializing shared storage with demo machines for cross-user sync');
        const { generateDemoMachines } = require('@/config/machines');
        const demoMachines = generateDemoMachines();
        localStorage.setItem(STORAGE_KEYS.SHARED_MACHINES, JSON.stringify(demoMachines));
        return demoMachines.map(normalizeMachine);
      }

      const sharedMachines = JSON.parse(stored);
      const machines = Array.isArray(sharedMachines) ? sharedMachines.map(normalizeMachine) : [];

      // Enhanced logging for debugging
      console.log(`📊 SHARED STORAGE: Loaded ${machines.length} machines from shared storage`);
      machines.forEach(m => {
        console.log(`  - ${m.id}: ${m.status} (power: ${m.powerStatus}, electricity: ${m.electricityStatus})`);
      });

      return machines;
    } catch (error) {
      console.warn('Failed to get machines from shared storage:', error);
      return [];
    }
  },

  // Force refresh shared storage data (useful for debugging)
  refreshSharedStorage: (): void => {
    console.log('🔄 FORCE REFRESH: Manually refreshing shared storage...');
    // Trigger a storage event to notify all listening components
    window.dispatchEvent(new CustomEvent('forceRefreshMachines'));
  },

  // Debug helper to see current state
  debugStorageState: (): void => {
    console.log('=== STORAGE DEBUG STATE ===');
    const localMachines = dataManager.getAllMachines();
    const sharedMachines = dataManager.getAllMachinesFromSharedStorage();
    console.log(`Local machines: ${localMachines.length}`);
    console.log(`Shared machines: ${sharedMachines.length}`);
    console.log('Local:', localMachines.map(m => `${m.id}:${m.status}`));
    console.log('Shared:', sharedMachines.map(m => `${m.id}:${m.status}`));
    console.log('============================');
  },
};
