// Machine and Location Configuration
// Dynamic configuration for offices, locations, and demo machine data

import { SUPPLY_TYPES, SUPPLY_DEFAULTS, MACHINE_STATUS, POWER_STATUS, ELECTRICITY_STATUS, FILTER_STATUS, CLEANING_STATUS } from './index';

// ========================================
// OFFICE AND LOCATION CONFIGURATION
// ========================================
export const OFFICE_LOCATIONS = [
  {
    id: "hinjewadi-it-park",
    name: "Hinjewadi IT Park",
    city: "pune",
    buildings: [
      {
        id: "building-a2",
        name: "Building A2",
        floors: ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"]
      },
      {
        id: "building-b1", 
        name: "Building B1",
        floors: ["Floor 1", "Floor 2", "Floor 3"]
      }
    ]
  },
  {
    id: "koregaon-park-office",
    name: "Koregaon Park Office", 
    city: "pune",
    buildings: [
      {
        id: "ground-floor",
        name: "Ground Floor",
        floors: ["Floor 1"]
      }
    ]
  },
  {
    id: "mumbai-bkc",
    name: "Mumbai BKC",
    city: "mumbai", 
    buildings: [
      {
        id: "tower-1",
        name: "Tower 1",
        floors: ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"]
      }
    ]
  },
  {
    id: "tech-tower",
    name: "Tech Tower",
    city: "bangalore",
    buildings: [
      {
        id: "main-building",
        name: "Main Building", 
        floors: ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"]
      }
    ]
  }
] as const;

// Helper functions for location data
export const getOfficeById = (id: string) => 
  OFFICE_LOCATIONS.find(office => office.id === id);

export const getOfficesByCity = (city: string) =>
  OFFICE_LOCATIONS.filter(office => office.city === city);

export const getAllCities = () =>
  [...new Set(OFFICE_LOCATIONS.map(office => office.city))];

export const getAllOfficeNames = () =>
  OFFICE_LOCATIONS.map(office => office.name);

// ========================================
// DEMO MACHINE CONFIGURATION
// ========================================
export interface MachineConfig {
  id: string;
  machineId: string;
  name: string;
  location: string;
  office: string;
  floor: string;
  status: string;
  powerStatus: string;
  electricityStatus: string;
  lastPowerUpdate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  supplies: Record<string, number>;
  maintenance: {
    filterStatus: string;
    cleaningStatus: string;
    pressure: number;
  };
  usage: {
    dailyCups: number;
    weeklyCups: number;
  };
  notes: string;
  alerts: any[];
  recentRefills: any[];
}

// Function to generate demo machine data dynamically
export const generateDemoMachines = (): MachineConfig[] => {
  const machines: MachineConfig[] = [];
  
  // Generate machines for each office location
  OFFICE_LOCATIONS.forEach((office, officeIndex) => {
    office.buildings.forEach((building, buildingIndex) => {
      building.floors.forEach((floor, floorIndex) => {
        // Generate 1-2 machines per floor based on configuration
        const machinesPerFloor = officeIndex === 0 ? 2 : 1; // More machines in main office
        
        for (let machineIndex = 0; machineIndex < machinesPerFloor; machineIndex++) {
          const machineNumber = String(officeIndex * 10 + buildingIndex * 5 + floorIndex + machineIndex + 1).padStart(3, '0');
          const machineId = `${office.id.split('-')[0].toUpperCase()}-${machineNumber}`;
          
          machines.push({
            id: machineId,
            machineId: machineId,
            name: `Coffee ${['Station', 'Hub', 'Express', 'Pro', 'Elite'][machineIndex % 5]} ${['Alpha', 'Beta', 'Gamma', 'Delta'][machineIndex % 4]}`,
            location: `${office.name} - ${building.name}`,
            office: office.name,
            floor: floor,
            status: MACHINE_STATUS.OPERATIONAL,
            powerStatus: POWER_STATUS.ONLINE,
            electricityStatus: ELECTRICITY_STATUS.AVAILABLE,
            lastPowerUpdate: new Date(Date.now() - Math.random() * 86400000).toLocaleString(), // Random time in last 24h
            lastMaintenance: new Date(Date.now() - Math.random() * 2592000000).toISOString().split('T')[0], // Random time in last 30 days
            nextMaintenance: new Date(Date.now() + Math.random() * 2592000000).toISOString().split('T')[0], // Random time in next 30 days
            supplies: {
              [SUPPLY_TYPES.WATER]: Math.floor(Math.random() * 40) + 60, // 60-100%
              [SUPPLY_TYPES.MILK]: Math.floor(Math.random() * 50) + 30, // 30-80%
              [SUPPLY_TYPES.COFFEE]: Math.floor(Math.random() * 40) + 50, // 50-90%
              [SUPPLY_TYPES.SUGAR]: Math.floor(Math.random() * 30) + 70, // 70-100%
            },
            maintenance: {
              filterStatus: FILTER_STATUS.GOOD,
              cleaningStatus: CLEANING_STATUS.CLEAN,
              pressure: Math.floor(Math.random() * 6) + 12, // 12-18 pressure
            },
            usage: {
              dailyCups: Math.floor(Math.random() * 100) + 50, // 50-150 cups
              weeklyCups: Math.floor(Math.random() * 500) + 300, // 300-800 cups
            },
            notes: `Machine running smoothly. Located in ${building.name}, ${floor}.`,
            alerts: [],
            recentRefills: []
          });
        }
      });
    });
  });
  
  return machines;
};

// ========================================
// DEMO USER CONFIGURATION
// ========================================
export interface DemoUser {
  id: string;
  username: string;
  role: string;
  name: string;
  city?: string;
  officeName?: string;
}

// Generate demo users dynamically based on office configuration
export const generateDemoUsers = (): DemoUser[] => {
  const users: DemoUser[] = [];
  
  // Generate admin user
  users.push({
    id: "admin-001",
    username: "admin1",
    role: "admin",
    name: "System Administrator",
    city: undefined,
    officeName: undefined, // Admin has access to all offices
  });
  
  // Generate technician users for each office
  OFFICE_LOCATIONS.forEach((office, index) => {
    users.push({
      id: `tech-${String(index + 1).padStart(3, '0')}`,
      username: `tech${index + 1}`,
      role: "technician",
      name: `${office.name} Technician`,
      city: office.city,
      officeName: office.name,
    });
  });
  
  return users;
};

// Helper functions for user management
export const getDemoUserByUsername = (username: string) =>
  generateDemoUsers().find(user => user.username === username);

export const getTechniciansByOffice = (officeName: string) =>
  generateDemoUsers().filter(user => user.role === "technician" && user.officeName === officeName);

export const getAllTechnicians = () =>
  generateDemoUsers().filter(user => user.role === "technician");

// ========================================
// MACHINE GENERATION UTILITIES
// ========================================

// Generate specific machine for testing
export const generateTestMachine = (overrides: Partial<MachineConfig> = {}): MachineConfig => ({
  id: "TEST-001",
  machineId: "TEST-001",
  name: "Test Coffee Machine",
  location: "Test Location",
  office: "Test Office",
  floor: "Floor 1",
  status: MACHINE_STATUS.OPERATIONAL,
  powerStatus: POWER_STATUS.ONLINE,
  electricityStatus: ELECTRICITY_STATUS.AVAILABLE,
  lastPowerUpdate: new Date().toISOString(),
  lastMaintenance: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  nextMaintenance: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
  supplies: {
    [SUPPLY_TYPES.WATER]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
    [SUPPLY_TYPES.MILK]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
    [SUPPLY_TYPES.COFFEE]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
    [SUPPLY_TYPES.SUGAR]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
  },
  maintenance: {
    filterStatus: FILTER_STATUS.GOOD,
    cleaningStatus: CLEANING_STATUS.CLEAN,
    pressure: 15,
  },
  usage: {
    dailyCups: 100,
    weeklyCups: 700,
  },
  notes: "Test machine for development and testing purposes.",
  alerts: [],
  recentRefills: [],
  ...overrides,
});

// Generate machine with low supplies for testing alerts
export const generateLowSupplyMachine = (): MachineConfig =>
  generateTestMachine({
    id: "LOW-001",
    machineId: "LOW-001", 
    name: "Low Supply Test Machine",
    supplies: {
      [SUPPLY_TYPES.WATER]: 15, // Below threshold
      [SUPPLY_TYPES.MILK]: 10,  // Below threshold
      [SUPPLY_TYPES.COFFEE]: 5, // Critical
      [SUPPLY_TYPES.SUGAR]: 25, // Just above threshold
    },
    status: MACHINE_STATUS.MAINTENANCE,
  });

// ========================================
// VALIDATION AND HELPERS
// ========================================

// Validate machine configuration
export const validateMachineConfig = (machine: Partial<MachineConfig>): string[] => {
  const errors: string[] = [];
  
  if (!machine.name || machine.name.length < 3) {
    errors.push("Machine name must be at least 3 characters long");
  }
  
  if (!machine.office) {
    errors.push("Office is required");
  }
  
  if (!machine.location) {
    errors.push("Location is required");
  }
  
  if (machine.supplies) {
    Object.entries(machine.supplies).forEach(([key, value]) => {
      if (typeof value !== 'number' || value < 0 || value > 100) {
        errors.push(`Supply ${key} must be a number between 0 and 100`);
      }
    });
  }
  
  return errors;
};

// Check if office name is valid
export const isValidOffice = (officeName: string): boolean =>
  getAllOfficeNames().includes(officeName);

// Get available floors for an office
export const getFloorsForOffice = (officeName: string): string[] => {
  const office = OFFICE_LOCATIONS.find(o => o.name === officeName);
  if (!office) return [];
  
  return office.buildings.flatMap(building => building.floors);
};

export default {
  OFFICE_LOCATIONS,
  generateDemoMachines,
  generateDemoUsers,
  generateTestMachine,
  generateLowSupplyMachine,
  validateMachineConfig,
  getOfficeById,
  getOfficesByCity,
  getAllCities,
  getAllOfficeNames,
  getDemoUserByUsername,
  getTechniciansByOffice,
  getAllTechnicians,
  isValidOffice,
  getFloorsForOffice,
};
