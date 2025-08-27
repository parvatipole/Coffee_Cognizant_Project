// API Configuration and JWT Token Management
// STANDALONE MODE: Frontend works independently, ready for backend integration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const STANDALONE_MODE = import.meta.env.VITE_STANDALONE_MODE !== "false"; // Default to standalone

// Debug logging for local development
const DEBUG = import.meta.env.VITE_DEBUG === "true" || import.meta.env.DEV;

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem("coffee_auth_token");
  },

  setToken: (token: string): void => {
    localStorage.setItem("coffee_auth_token", token);
  },

  removeToken: (): void => {
    localStorage.removeItem("coffee_auth_token");
    localStorage.removeItem("coffee_auth_user");
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

// Standalone mode data - simulates backend responses for development
const standaloneData = {
  machines: [
    {
      id: "HIJ-001",
      machineId: "HIJ-001",
      name: "Coffee Station Alpha",
      location: "Hinjewadi IT Park - Building A2",
      office: "Hinjewadi IT Park",
      floor: "Floor 3",
      status: "operational",
      powerStatus: "online",
      electricityStatus: "available",
      lastPowerUpdate: "2024-01-16 09:30",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      supplies: { water: 85, milk: 60, coffee: 75, sugar: 90 },
      maintenance: {
        filterStatus: "good",
        cleaningStatus: "clean",
        pressure: 15,
      },
      usage: { dailyCups: 127, weeklyCups: 890 },
      notes: "Machine running smoothly. Recent cleaning completed on schedule.",
      alerts: [],
      recentRefills: []
    },
    {
      id: "HIJ-002",
      machineId: "HIJ-002",
      name: "Espresso Hub Beta",
      location: "Hinjewadi IT Park - Building B1",
      office: "Hinjewadi IT Park",
      floor: "Floor 2",
      status: "operational",
      powerStatus: "online",
      electricityStatus: "available",
      lastPowerUpdate: "2024-01-16 08:45",
      lastMaintenance: "2024-01-12",
      nextMaintenance: "2024-02-12",
      supplies: { water: 92, milk: 45, coffee: 88, sugar: 76 },
      maintenance: {
        filterStatus: "good",
        cleaningStatus: "clean",
        pressure: 14,
      },
      usage: { dailyCups: 98, weeklyCups: 686 },
      notes: "High performance. Minor calibration needed.",
      alerts: [],
      recentRefills: []
    },
    {
      id: "KOR-001",
      machineId: "KOR-001",
      name: "Executive Espresso",
      location: "Koregaon Park Office - Ground Floor",
      office: "Koregaon Park Office",
      floor: "Floor 1",
      status: "operational",
      powerStatus: "online",
      electricityStatus: "available",
      lastPowerUpdate: "2024-01-16 10:15",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-02-05",
      supplies: { water: 78, milk: 80, coffee: 65, sugar: 95 },
      maintenance: {
        filterStatus: "good",
        cleaningStatus: "clean",
        pressure: 12,
      },
      usage: { dailyCups: 89, weeklyCups: 650 },
      notes: "Popular machine. Consistent performance.",
      alerts: [],
      recentRefills: []
    }
  ]
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
    // In standalone mode, return mock data
    if (STANDALONE_MODE) {
      return this.handleStandaloneRequest<T>(endpoint, options);
    }

    // Real API request for backend integration
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
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (response.status === 401) {
        tokenManager.removeToken();
        throw new Error("Authentication required");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Backend unavailable - check connection");
      }
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout - please check your connection");
      }
      throw error;
    }
  }

  private async handleStandaloneRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulate network delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

    const method = options.method || 'GET';
    
    // Handle different endpoints in standalone mode
    switch (true) {
      case endpoint === '/machines' && method === 'GET':
        return standaloneData.machines as T;

      case endpoint.startsWith('/machines/machine/') && method === 'GET':
        const machineId = endpoint.split('/').pop();
        const machine = standaloneData.machines.find(m => m.id === machineId || m.machineId === machineId);
        if (!machine) throw new Error('Machine not found');
        return machine as T;

      case endpoint.startsWith('/machines/') && method === 'PUT':
        const updateId = endpoint.split('/')[2];
        const updateData = JSON.parse(options.body as string);
        const machineIndex = standaloneData.machines.findIndex(m => m.id === updateId || m.machineId === updateId);
        if (machineIndex !== -1) {
          standaloneData.machines[machineIndex] = { ...standaloneData.machines[machineIndex], ...updateData };
          return standaloneData.machines[machineIndex] as T;
        }
        throw new Error('Machine not found');

      case endpoint.includes('/supplies') && method === 'PUT':
        const supplyId = endpoint.split('/')[2];
        const supplyData = JSON.parse(options.body as string);
        const supplyMachineIndex = standaloneData.machines.findIndex(m => m.id === supplyId || m.machineId === supplyId);
        if (supplyMachineIndex !== -1) {
          standaloneData.machines[supplyMachineIndex].supplies = { 
            ...standaloneData.machines[supplyMachineIndex].supplies, 
            ...supplyData.supplies 
          };
          return { message: "Supplies updated successfully" } as T;
        }
        throw new Error('Machine not found');

      case endpoint === '/auth/signin' && method === 'POST':
        const { username, password } = JSON.parse(options.body as string);
        // Simple standalone authentication
        if (username && password) {
          const token = btoa(JSON.stringify({ username, exp: Date.now() / 1000 + 3600 }));
          return {
            accessToken: token,
            tokenType: "Bearer",
            id: 1,
            username,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            role: username.includes('tech') ? 'technician' : 'employee',
            authorities: []
          } as T;
        }
        throw new Error('Invalid credentials');

      case endpoint === '/auth/signup' && method === 'POST':
        return { message: "User registered successfully" } as T;

      case endpoint === '/auth/signout' && method === 'POST':
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
    }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async signup(username: string, name: string, password: string, officeName: string) {
    return this.makeRequest<{ message: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, name, password, officeName }),
    });
  }

  async logout() {
    return this.makeRequest("/auth/signout", {
      method: "POST",
    });
  }

  // Coffee Machines endpoints
  async getMachines() {
    return this.makeRequest<any[]>("/machines");
  }

  async createMachine(machineData: any) {
    return this.makeRequest<any>("/machines", {
      method: "POST",
      body: JSON.stringify(machineData),
    });
  }

  async getMachine(id: string) {
    return this.makeRequest<any>(`/machines/${id}`);
  }

  async getMachineByMachineId(machineId: string) {
    return this.makeRequest<any>(`/machines/machine/${machineId}`);
  }

  async updateMachine(id: string, data: any) {
    return this.makeRequest<any>(`/machines/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateSupplies(id: string, supplies: any) {
    return this.makeRequest<{ message: string }>(`/machines/${id}/supplies`, {
      method: "PUT",
      body: JSON.stringify(supplies),
    });
  }

  // Location navigation endpoints
  async getLocations() {
    const uniqueLocations = [...new Set(standaloneData.machines.map(m => m.office))];
    return this.makeRequest<string[]>("/machines/locations").catch(() => uniqueLocations);
  }

  async getOffices(location: string) {
    const offices = standaloneData.machines
      .filter(m => m.office === location)
      .map(m => m.office);
    return this.makeRequest<string[]>(`/machines/offices?location=${encodeURIComponent(location)}`)
      .catch(() => [...new Set(offices)]);
  }

  async getFloors(location: string, office: string) {
    const floors = standaloneData.machines
      .filter(m => m.office === office)
      .map(m => m.floor);
    return this.makeRequest<string[]>(`/machines/floors?location=${encodeURIComponent(location)}&office=${encodeURIComponent(office)}`)
      .catch(() => [...new Set(floors)]);
  }

  async getMachinesByLocationOfficeFloor(location: string, office: string, floor: string) {
    const machines = standaloneData.machines.filter(m => 
      m.office === office && m.floor === floor
    );
    return this.makeRequest<any[]>(`/machines/by-location-office-floor?location=${encodeURIComponent(location)}&office=${encodeURIComponent(office)}&floor=${encodeURIComponent(floor)}`)
      .catch(() => machines);
  }

  // Monitoring endpoints
  async getLowSupplyMachines(threshold: number = 30) {
    const lowSupplyMachines = standaloneData.machines.filter(m =>
      Object.values(m.supplies).some(supply => supply < threshold)
    );
    return this.makeRequest<any[]>(`/machines/low-supplies?threshold=${threshold}`)
      .catch(() => lowSupplyMachines);
  }

  async getMaintenanceNeededMachines() {
    const maintenanceMachines = standaloneData.machines.filter(m =>
      m.maintenance.filterStatus === 'needs_replacement' || 
      m.maintenance.cleaningStatus === 'needs_cleaning'
    );
    return this.makeRequest<any[]>("/machines/maintenance-needed")
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
