# Backend Integration Guide

This document outlines how to integrate your backend with the Coffee Manager frontend.

## Current Status

✅ **Frontend**: Fully functional in standalone mode  
⏳ **Backend**: Ready for integration

## Quick Setup

1. **Frontend is ready** - runs independently with mock data
2. **To integrate your backend**:
   - Set `VITE_STANDALONE_MODE=false`
   - Set `VITE_API_BASE_URL=your-backend-url/api`
   - Implement the required API endpoints below

## Required API Endpoints

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

## Key Notes

1. **Frontend Key Mapping**: 
   - Frontend uses `coffeeBeans` but backend should use `coffee`
   - The frontend automatically handles this mapping

2. **Authentication**:
   - JWT tokens in Authorization header
   - Frontend handles token storage and expiration

3. **Error Handling**:
   - Return proper HTTP status codes
   - Include error messages in response body
   - 401 for authentication errors

4. **CORS**:
   - Enable CORS for your frontend domain
   - Allow credentials for authentication

## Environment Setup

Backend developers should know the frontend expects:

```bash
# When backend is ready
VITE_STANDALONE_MODE=false
VITE_API_BASE_URL=http://your-backend-url/api
```

## Testing Integration

1. Set environment variables
2. Start your backend server
3. Start frontend with `npm run dev`
4. Frontend will automatically switch from standalone to backend mode

## Alert Generation Logic

The frontend generates alerts automatically based on:
- Supply levels < 20%
- Electricity status = "unavailable" 
- Filter status = "needs_replacement"
- Cleaning status = "needs_cleaning"

Your backend can override this by providing alerts in the machine data.

## Questions?

The frontend is designed to be completely independent and backend-agnostic. Any standard REST API that implements the above endpoints will work seamlessly.
