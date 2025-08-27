# Backend Integration Guide

This document outlines how to integrate your backend with the Coffee Manager frontend.

## Current Status

✅ **Frontend**: Fully functional with development server  
✅ **Development Server**: Minimal server for Vite integration  
⏳ **Backend**: Ready for integration

## Hybrid Development Approach

The current setup provides:
1. **Development Server**: Minimal Express server that integrates with Vite
2. **Automatic Fallback**: Falls back to frontend-only mode when backend endpoints aren't implemented
3. **Seamless Integration**: Easy to add real backend endpoints without changing frontend code

## Quick Setup

### Current Development Mode
```bash
npm run dev  # Starts Vite + development server
```

### Backend Integration Process
1. **Implement API endpoints** (see below)
2. **No frontend changes needed** - automatic detection
3. **Frontend automatically uses backend** when endpoints return real data

## How It Works

```
Frontend Request → Development Server → Backend (if implemented)
                                   ↓
                               Returns 501 "Not Implemented"
                                   ↓
                          Frontend uses standalone mode
```

## Required API Endpoints

When you implement these endpoints in the development server, they'll automatically be used:

### Authentication
```http
POST /api/auth/signin
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: {
  "accessToken": "string",
  "tokenType": "Bearer",
  "id": number,
  "username": "string", 
  "name": "string",
  "role": "technician" | "employee",
  "authorities": string[]
}
```

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "string",
  "name": "string", 
  "password": "string",
  "officeName": "string"
}

Response: {
  "message": "string"
}
```

```http
POST /api/auth/signout
Authorization: Bearer {token}

Response: {
  "message": "string"  
}
```

### Machine Management
```http
GET /api/machines
Authorization: Bearer {token}

Response: Machine[] (see data model below)
```

```http
GET /api/machines/machine/{machineId}
Authorization: Bearer {token}

Response: Machine (see data model below)
```

```http
PUT /api/machines/{id}
Authorization: Bearer {token}
Content-Type: application/json

Body: Partial<Machine>

Response: Machine
```

```http
PUT /api/machines/{id}/supplies  
Authorization: Bearer {token}
Content-Type: application/json

{
  "supplies": {
    "water": number,    // 0-100
    "milk": number,     // 0-100  
    "coffee": number,   // 0-100 (note: frontend uses "coffeeBeans" but backend expects "coffee")
    "sugar": number     // 0-100
  }
}

Response: {
  "message": "string"
}
```

### Location Management
```http
GET /api/machines/locations
Authorization: Bearer {token}

Response: string[] // Array of unique locations
```

```http
GET /api/machines/offices?location={location}
Authorization: Bearer {token}

Response: string[] // Array of offices in location
```

```http
GET /api/machines/floors?location={location}&office={office}
Authorization: Bearer {token}

Response: string[] // Array of floors in office
```

```http
GET /api/machines/by-location-office-floor?location={location}&office={office}&floor={floor}
Authorization: Bearer {token}

Response: Machine[] // Machines in specific location
```

### Monitoring
```http
GET /api/machines/low-supplies?threshold={number}
Authorization: Bearer {token}

Response: Machine[] // Machines with supplies below threshold
```

```http
GET /api/machines/maintenance-needed
Authorization: Bearer {token}

Response: Machine[] // Machines needing maintenance
```

## Implementation Steps

### 1. Add Endpoint to Development Server

Edit `server/index.ts` and add your endpoint:

```typescript
// Example: Implement the machines endpoint
app.get("/api/machines", authenticateToken, async (req, res) => {
  try {
    // Your database logic here
    const machines = await getMachinesFromDatabase();
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. No Frontend Changes Needed

The frontend automatically detects when an endpoint is implemented and starts using it instead of mock data.

### 3. Test Integration

```bash
# Start development server
npm run dev

# Frontend will automatically use your implemented endpoints
```

## Data Models

### Machine
```typescript
interface Machine {
  id: string;                    // Primary key
  machineId: string;            // Machine identifier  
  name: string;                 // Display name
  location: string;             // Full location string
  office: string;               // Office name
  floor: string;                // Floor identifier
  status: "operational" | "maintenance" | "offline";
  powerStatus: "online" | "offline";  
  electricityStatus: "available" | "unavailable";
  lastPowerUpdate: string;      // ISO date string
  lastMaintenance: string;      // ISO date string
  nextMaintenance: string;      // ISO date string
  supplies: {
    water: number;              // Percentage 0-100
    milk: number;               // Percentage 0-100
    coffee: number;             // Percentage 0-100 (backend key)
    sugar: number;              // Percentage 0-100
  };
  maintenance: {
    filterStatus: "good" | "needs_replacement" | "critical";
    cleaningStatus: "clean" | "needs_cleaning" | "overdue";  
    pressure: number;           // Pressure in bar
  };
  usage: {
    dailyCups: number;
    weeklyCups: number;
  };
  notes: string;                // Technician notes
  alerts?: Alert[];             // Optional alerts array
  recentRefills?: Refill[];     // Optional refills history
}
```

### Alert
```typescript
interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  category: "maintenance" | "supply" | "cleaning" | "system";
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;          // ISO date string
  createdAt: string;            // ISO date string
}
```

### Refill
```typescript
interface Refill {
  id: string;
  supplyType: "water" | "milk" | "coffeeBeans" | "sugar";
  supplyName: string;           // Display name
  amount: number;               // Final percentage
  refillAmount: number;         // Amount added
  timestamp: string;            // ISO date string
  technician: string;           // Who performed refill
}
```

## Benefits of This Approach

1. **No Configuration Changes**: Frontend automatically detects backend availability
2. **Gradual Implementation**: Implement endpoints one by one
3. **Always Working**: Frontend works even with partial backend implementation
4. **Easy Testing**: Real backend integration without complex setup
5. **Production Ready**: Same code works in development and production

## Environment Variables

```bash
# Optional - for external backend
VITE_API_BASE_URL=http://your-external-backend/api

# Optional - force standalone mode
VITE_STANDALONE_MODE=true
```

## Development Commands

```bash
npm run dev              # Start Vite + development server (recommended)
npm run dev:server       # Start only the development server on port 8080
npm run build           # Build for production
```

## Questions?

This hybrid approach ensures the frontend always works while making backend integration seamless. Just implement the endpoints in `server/index.ts` and the frontend will automatically start using them!
