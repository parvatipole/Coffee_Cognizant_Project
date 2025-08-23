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
  lastPowerUpdate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  supplies: {
    water: number;
    milk: number;
    coffee: number;
    sugar: number;
  };
  maintenance: {
    filterStatus: 'good' | 'needs_replacement' | 'critical';
    cleaningStatus: 'clean' | 'needs_cleaning' | 'overdue';
    temperature: number;
    pressure: number;
  };
  usage: {
    dailyCups: number;
    weeklyCups: number;
  };
  notes: string;
  alerts?: any[];
}

const STORAGE_KEYS = {
  MACHINES: 'coffee_machines',
  LAST_SYNC: 'coffee_last_sync',
} as const;

export const dataManager = {
  // Save machine data to localStorage
  saveMachine: (machine: MachineData): void => {
    const existingMachines = dataManager.getAllMachines();
    const updatedMachines = existingMachines.filter(m => m.id !== machine.id);
    updatedMachines.push(machine);
    
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(updatedMachines));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  },

  // Get all machines from localStorage
  getAllMachines: (): MachineData[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MACHINES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load machines from localStorage:', error);
      return [];
    }
  },

  // Get machine by ID
  getMachine: (id: string): MachineData | null => {
    const machines = dataManager.getAllMachines();
    return machines.find(m => m.id === id || m.machineId === id) || null;
  },

  // Update machine supplies
  updateMachineSupplies: (id: string, supplies: Partial<MachineData['supplies']>): void => {
    const machines = dataManager.getAllMachines();
    const machineIndex = machines.findIndex(m => m.id === id || m.machineId === id);
    
    if (machineIndex !== -1) {
      machines[machineIndex].supplies = {
        ...machines[machineIndex].supplies,
        ...supplies,
      };
      localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));
    }
  },

  // Update entire machine
  updateMachine: (id: string, updates: Partial<MachineData>): void => {
    const machines = dataManager.getAllMachines();
    const machineIndex = machines.findIndex(m => m.id === id || m.machineId === id);
    
    if (machineIndex !== -1) {
      machines[machineIndex] = {
        ...machines[machineIndex],
        ...updates,
      };
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
    return {
      ...backendData,
      supplies: {
        water: backendData.supplies?.water || 0,
        milk: backendData.supplies?.milk || 0,
        coffee: backendData.supplies?.coffee || backendData.supplies?.coffeeBeans || 0,
        sugar: backendData.supplies?.sugar || 0,
      },
    };
  },

  // Map frontend data format to backend format
  mapFrontendToBackend: (frontendData: any): any => {
    return {
      ...frontendData,
      supplies: {
        water: frontendData.supplies?.water || 0,
        milk: frontendData.supplies?.milk || 0,
        coffee: frontendData.supplies?.coffee || frontendData.supplies?.coffeeBeans || 0,
        sugar: frontendData.supplies?.sugar || 0,
      },
    };
  },
};
