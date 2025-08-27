// Data persistence management for coffee machines
// Handles localStorage persistence and data synchronization

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

const STORAGE_KEYS = {
  MACHINES: 'coffee_machines',
  SHARED_MACHINES: 'coffee_shared_machines', // Shared storage for cross-user visibility
  LAST_SYNC: 'coffee_last_sync',
} as const;

// Normalize supplies to ensure both coffeeBeans (UI) and coffee (backend) are in sync
const normalizeSupplies = (supplies: any) => {
  const coffeeBeans = supplies?.coffeeBeans ?? supplies?.coffee ?? 0;
  return {
    water: supplies?.water ?? 0,
    milk: supplies?.milk ?? 0,
    sugar: supplies?.sugar ?? 0,
    coffeeBeans: coffeeBeans,
    coffee: coffeeBeans,
  } as any;
};

const normalizeMachine = (machine: any) => {
  if (!machine) return machine;
  return {
    ...machine,
    supplies: normalizeSupplies(machine.supplies || {}),
  };
};

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

  // Get machine by ID
  getMachine: (id: string): MachineData | null => {
    const machines = dataManager.getAllMachines();
    const found = machines.find(m => m.id === id || m.machineId === id) || null;
    console.log(`🔍 DataManager: Looking for machine with id/machineId "${id}". Found: ${found ? `${found.id} (${found.machineId})` : 'null'}`);
    return found ? normalizeMachine(found) : null;
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
    }
  },

  // Remove machine
  removeMachine: (id: string): void => {
    const machines = dataManager.getAllMachines();
    const filteredMachines = machines.filter(m => m.id !== id && m.machineId !== id);
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(filteredMachines));
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
        water: supplies.water,
        milk: supplies.milk,
        sugar: supplies.sugar,
        coffee: supplies.coffee, // backend expects `coffee`
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
      sharedMachines = sharedMachines.filter((m: any) => {
        const matchesId = m.id === machine.id;
        const matchesMachineId = machine.machineId && m.machineId === machine.machineId;
        return !matchesId && !matchesMachineId;
      });

      // Add the updated machine
      sharedMachines.push(machine);

      // Save back to shared storage
      localStorage.setItem(STORAGE_KEYS.SHARED_MACHINES, JSON.stringify(sharedMachines));
      console.log(`🔄 DataManager: Synced machine ${machine.id} to shared storage for cross-user visibility`);
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
      if (!stored) return [];

      const sharedMachines = JSON.parse(stored);
      return Array.isArray(sharedMachines) ? sharedMachines.map(normalizeMachine) : [];
    } catch (error) {
      console.warn('Failed to get machines from shared storage:', error);
      return [];
    }
  },
};
