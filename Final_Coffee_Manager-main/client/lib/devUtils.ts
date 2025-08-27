// Development utilities for testing and debugging
// These utilities are only available in development mode

import { testDataPersistence } from './testDataPersistence';

// Make test functions available in browser console during development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).devUtils = {
    testDataPersistence,
    
    // Helper to inspect localStorage data
    inspectStoredMachines: () => {
      const stored = localStorage.getItem('coffee_machines');
      const machines = stored ? JSON.parse(stored) : [];
      console.log('📦 Stored machines in localStorage:', machines);
      return machines;
    },
    
    // Helper to clear all stored data
    clearStoredData: () => {
      localStorage.removeItem('coffee_machines');
      localStorage.removeItem('coffee_last_sync');
      console.log('🗑️ Cleared all stored coffee machine data');
    }
  };
  
  console.log('🛠️ Development utilities loaded. Available in window.devUtils:');
  console.log('  - testDataPersistence(): Test the data persistence fix');
  console.log('  - inspectStoredMachines(): View stored machines');
  console.log('  - clearStoredData(): Clear all stored data');
}

export { testDataPersistence };
