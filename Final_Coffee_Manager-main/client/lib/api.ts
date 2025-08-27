// API Configuration and JWT Token Management
// STANDALONE MODE: Frontend works independently, ready for backend integration

import { ENV_CONFIG, STORAGE_KEYS, API_ENDPOINTS, ALERT_THRESHOLDS, USER_ROLES } from "@/config";
import { generateDemoMachines } from "@/config/machines";

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;
const STANDALONE_MODE = ENV_CONFIG.STANDALONE_MODE;

// Debug logging for local development
const DEBUG = ENV_CONFIG.DEBUG;

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },
};

// Shared data storage for standalone mode - ensures all users see the same data
const SHARED_MACHINES_KEY = STORAGE_KEYS.SHARED_MACHINES;

// Get default machine data from dynamic configuration
const getDefaultMachineData = () => generateDemoMachines();

// Shared data manager for standalone mode
const sharedDataManager = {
  // Get all machines from shared storage (simulates backend database)
  getMachines: () => {
    try {
      const stored = localStorage.getItem(SHARED_MACHINES_KEY);
      if (!stored) {
        // Initialize with dynamically generated default data if not exists
        const defaultData = getDefaultMachineData();
        console.log('🔧 Initializing shared machine data for standalone mode');
        localStorage.setItem(SHARED_MACHINES_KEY, JSON.stringify(defaultData));
        return defaultData;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to load shared machines data:', error);
      return getDefaultMachineData();
    }
  },

  // Save all machines to shared storage
  saveMachines: (machines: any[]) => {
    try {
      localStorage.setItem(SHARED_MACHINES_KEY, JSON.stringify(machines));
      console.log('💾 Shared data: Saved machines to shared storage');
    } catch (error) {
      console.error('Failed to save machines to shared storage:', error);
    }
  },

  // Update a specific machine in shared storage
  updateMachine: (id: string, updateData: any) => {
    const machines = sharedDataManager.getMachines();
    const machineIndex = machines.findIndex((m: any) => m.id === id || m.machineId === id);
    if (machineIndex !== -1) {
      machines[machineIndex] = { ...machines[machineIndex], ...updateData };
      sharedDataManager.saveMachines(machines);
      console.log(`💾 Shared data: Updated machine ${id} in shared storage`);
      return machines[machineIndex];
    }
    throw new Error('Machine not found in shared storage');
  },

  // Update machine supplies in shared storage
  updateMachineSupplies: (id: string, supplies: any) => {
    const machines = sharedDataManager.getMachines();
    const machineIndex = machines.findIndex((m: any) => m.id === id || m.machineId === id);
    if (machineIndex !== -1) {
      machines[machineIndex].supplies = { ...machines[machineIndex].supplies, ...supplies };
      sharedDataManager.saveMachines(machines);
      console.log(`💾 Shared data: Updated supplies for machine ${id} in shared storage`);
      return machines[machineIndex];
    }
    throw new Error('Machine not found in shared storage');
  }
};

// API Client with standalone mode support
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    // If explicitly in standalone mode, use mock data
    if (STANDALONE_MODE) {
      return this.handleStandaloneRequest<T>(endpoint, options);
    }

    // Try real API request first
    const url = `${this.baseURL}${endpoint}`;
    const token = tokenManager.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token && !tokenManager.isTokenExpired(token)) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(ENV_CONFIG.REQUEST_TIMEOUT),
      });

      // Handle authentication errors
      if (response.status === 401) {
        tokenManager.removeToken();
        throw new Error("Authentication required");
      }

      // Handle 501 Not Implemented - development server fallback
      if (response.status === 501) {
        console.log(`🔄 API endpoint ${endpoint} not implemented, using standalone mode`);
        return this.handleStandaloneRequest<T>(endpoint, options);
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      // Network errors - fallback to standalone mode
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.log(`🔄 Backend unavailable for ${endpoint}, using standalone mode`);
        return this.handleStandaloneRequest<T>(endpoint, options);
      }

      if (error instanceof Error && error.name === "AbortError") {
        console.log(`⏱️ Request timeout for ${endpoint}, using standalone mode`);
        return this.handleStandaloneRequest<T>(endpoint, options);
      }

      throw error;
    }
  }

  private async handleStandaloneRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulate network delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

    const method = options.method || 'GET';

    // Handle different endpoints in standalone mode using shared data storage
    switch (true) {
      case endpoint === API_ENDPOINTS.MACHINES && method === 'GET':
        const allMachines = sharedDataManager.getMachines();
        console.log('🔄 Shared data: Retrieved all machines from shared storage');
        return allMachines as T;

      case endpoint.startsWith('/machines/machine/') && method === 'GET':
        const machineId = endpoint.split('/').pop();
        const machines = sharedDataManager.getMachines();
        const machine = machines.find((m: any) => m.id === machineId || m.machineId === machineId);
        if (!machine) throw new Error('Machine not found');
        console.log(`🔄 Shared data: Retrieved machine ${machineId} from shared storage`);
        return machine as T;

      case endpoint.startsWith('/machines/') && method === 'PUT':
        const updateId = endpoint.split('/')[2];
        const updateData = JSON.parse(options.body as string);
        try {
          const updatedMachine = sharedDataManager.updateMachine(updateId, updateData);
          console.log(`✅ Shared data: Machine ${updateId} updated in shared storage`);
          return updatedMachine as T;
        } catch (error) {
          throw new Error('Machine not found');
        }

      case endpoint.includes('/supplies') && method === 'PUT':
        const supplyId = endpoint.split('/')[2];
        const supplyData = JSON.parse(options.body as string);
        try {
          sharedDataManager.updateMachineSupplies(supplyId, supplyData.supplies);
          console.log(`✅ Shared data: Supplies updated for machine ${supplyId} in shared storage`);
          return { message: "Supplies updated successfully" } as T;
        } catch (error) {
          throw new Error('Machine not found');
        }

      case endpoint === API_ENDPOINTS.SIGNIN && method === 'POST':
        const { username, password } = JSON.parse(options.body as string);
        // Simple standalone authentication
        if (username && password) {
          const token = btoa(JSON.stringify({
            username,
            exp: Date.now() / 1000 + (ENV_CONFIG.TOKEN_EXPIRY_HOURS * 3600)
          }));
          return {
            accessToken: token,
            tokenType: "Bearer",
            id: 1,
            username,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            role: username.includes('tech') ? USER_ROLES.TECHNICIAN : USER_ROLES.ADMIN,
            authorities: []
          } as T;
        }
        throw new Error('Invalid credentials');

      case endpoint === API_ENDPOINTS.SIGNUP && method === 'POST':
        return { message: "User registered successfully" } as T;

      case endpoint === API_ENDPOINTS.SIGNOUT && method === 'POST':
        return { message: "Signed out successfully" } as T;

      default:
        throw new Error(`Endpoint ${endpoint} not implemented in standalone mode`);
    }
  }

  // Authentication endpoints
  async login(username: string, password: string) {
    return this.makeRequest<{
      accessToken: string;
      tokenType: string;
      id: number;
      username: string;
      name: string;
      role: string;
      authorities: string[];
    }>(API_ENDPOINTS.SIGNIN, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async signup(username: string, name: string, password: string, officeName: string) {
    return this.makeRequest<{ message: string }>(API_ENDPOINTS.SIGNUP, {
      method: "POST",
      body: JSON.stringify({ username, name, password, officeName }),
    });
  }

  async logout() {
    return this.makeRequest(API_ENDPOINTS.SIGNOUT, {
      method: "POST",
    });
  }

  // Coffee Machines endpoints
  async getMachines() {
    return this.makeRequest<any[]>(API_ENDPOINTS.MACHINES);
  }

  async createMachine(machineData: any) {
    return this.makeRequest<any>(API_ENDPOINTS.MACHINES, {
      method: "POST",
      body: JSON.stringify(machineData),
    });
  }

  async getMachine(id: string) {
    return this.makeRequest<any>(API_ENDPOINTS.MACHINE_BY_ID(id));
  }

  async getMachineByMachineId(machineId: string) {
    return this.makeRequest<any>(API_ENDPOINTS.MACHINE_BY_MACHINE_ID(machineId));
  }

  async updateMachine(id: string, data: any) {
    return this.makeRequest<any>(API_ENDPOINTS.MACHINE_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateSupplies(id: string, supplies: any) {
    return this.makeRequest<{ message: string }>(API_ENDPOINTS.MACHINE_SUPPLIES(id), {
      method: "PUT",
      body: JSON.stringify(supplies),
    });
  }

  // Location navigation endpoints
  async getLocations() {
    const machines = sharedDataManager.getMachines();
    const uniqueLocations = [...new Set(machines.map((m: any) => m.office))];
    return this.makeRequest<string[]>(API_ENDPOINTS.LOCATIONS).catch(() => uniqueLocations);
  }

  async getOffices(location: string) {
    const machines = sharedDataManager.getMachines();
    const offices = machines
      .filter((m: any) => m.office === location)
      .map((m: any) => m.office);
    return this.makeRequest<string[]>(`${API_ENDPOINTS.OFFICES}?location=${encodeURIComponent(location)}`)
      .catch(() => [...new Set(offices)]);
  }

  async getFloors(location: string, office: string) {
    const machines = sharedDataManager.getMachines();
    const floors = machines
      .filter((m: any) => m.office === office)
      .map((m: any) => m.floor);
    return this.makeRequest<string[]>(`${API_ENDPOINTS.FLOORS}?location=${encodeURIComponent(location)}&office=${encodeURIComponent(office)}`)
      .catch(() => [...new Set(floors)]);
  }

  async getMachinesByLocationOfficeFloor(location: string, office: string, floor: string) {
    const machines = sharedDataManager.getMachines();
    const filteredMachines = machines.filter((m: any) =>
      m.office === office && m.floor === floor
    );
    return this.makeRequest<any[]>(`${API_ENDPOINTS.MACHINES_BY_LOCATION}?location=${encodeURIComponent(location)}&office=${encodeURIComponent(office)}&floor=${encodeURIComponent(floor)}`)
      .catch(() => filteredMachines);
  }

  // Monitoring endpoints
  async getLowSupplyMachines(threshold: number = ALERT_THRESHOLDS.LOW_SUPPLY_WARNING) {
    const machines = sharedDataManager.getMachines();
    const lowSupplyMachines = machines.filter((m: any) =>
      Object.values(m.supplies).some((supply: any) => supply < threshold)
    );
    return this.makeRequest<any[]>(`${API_ENDPOINTS.LOW_SUPPLY_MACHINES}?threshold=${threshold}`)
      .catch(() => lowSupplyMachines);
  }

  async getMaintenanceNeededMachines() {
    const machines = sharedDataManager.getMachines();
    const maintenanceMachines = machines.filter((m: any) =>
      m.maintenance.filterStatus === 'needs_replacement' ||
      m.maintenance.cleaningStatus === 'needs_cleaning'
    );
    return this.makeRequest<any[]>(API_ENDPOINTS.MAINTENANCE_NEEDED)
      .catch(() => maintenanceMachines);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Helper function to check if running in standalone mode
export const isStandaloneMode = () => STANDALONE_MODE;

// Helper function to switch between standalone and backend mode
export const setStandaloneMode = (enabled: boolean) => {
  localStorage.setItem('VITE_STANDALONE_MODE', enabled.toString());
  window.location.reload(); // Reload to apply changes
};
