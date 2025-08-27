# Coffee Manager - Standalone Frontend

A production-ready React application for coffee machine management, running in standalone mode with backend integration readiness.

## Tech Stack

- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons
- **State Management**: React Hooks + LocalStorage
- **Testing**: Vitest

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── components/           # Coffee machine specific components
├── contexts/             # React contexts (Auth, etc.)
├── lib/                  # Utilities and API client
├── App.tsx              # App entry point with SPA routing setup
└── global.css           # TailwindCSS 3 theming and global styles

data/                     # Static data files (if needed)
public/                   # Static assets
```

## Key Features

### ⚡ Standalone Mode
- Frontend works completely independently
- No backend required for development/testing
- Mock data and API responses built-in
- Easy to switch to backend integration mode

### 🔧 Machine Management
- Real-time machine status monitoring
- Electricity status management (available/unavailable)
- Supply level tracking with automatic alerts
- Maintenance scheduling and tracking
- Technician notes and activity logging

### 🚨 Dynamic Alert System
- Automatic alerts when supplies < 20%
- Electricity unavailable notifications
- Maintenance reminders
- Real-time alert resolution tracking

### 📊 Analytics & Reporting
- Usage analytics and trends
- Supply consumption tracking
- Machine performance metrics
- Peak usage time analysis

### 🎛️ Technician Controls
- Machine status editing (operational/offline)
- Supply refill management
- Maintenance task tracking
- Real-time status updates

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page
- Routes are defined in `client/App.tsx` using `react-router-dom`
- Route files are located in the `client/pages/` directory

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build
npm run start      # Start production preview server
npm run typecheck  # TypeScript validation
npm test          # Run Vitest tests
```

## Backend Integration

### Current Mode: Standalone
The frontend currently runs in standalone mode with mock data and API responses.

### Switching to Backend Integration

1. **Set Environment Variable**:
   ```bash
   # Disable standalone mode
   VITE_STANDALONE_MODE=false
   
   # Set your backend API URL
   VITE_API_BASE_URL=http://your-backend-url/api
   ```

2. **Backend API Requirements**:
   The frontend expects these API endpoints:

   ```typescript
   // Authentication
   POST /api/auth/signin
   POST /api/auth/signup
   POST /api/auth/signout

   // Machines
   GET /api/machines
   GET /api/machines/:id
   GET /api/machines/machine/:machineId
   PUT /api/machines/:id
   PUT /api/machines/:id/supplies

   // Location & Monitoring
   GET /api/machines/locations
   GET /api/machines/offices?location=:location
   GET /api/machines/floors?location=:location&office=:office
   GET /api/machines/by-location-office-floor?location=:location&office=:office&floor=:floor
   GET /api/machines/low-supplies?threshold=:threshold
   GET /api/machines/maintenance-needed
   ```

3. **Data Models**:
   ```typescript
   interface Machine {
     id: string;
     machineId: string;
     name: string;
     location: string;
     office: string;
     floor: string;
     status: "operational" | "maintenance" | "offline";
     powerStatus: "online" | "offline";
     electricityStatus: "available" | "unavailable";
     lastPowerUpdate: string;
     supplies: {
       water: number;    // percentage 0-100
       milk: number;     // percentage 0-100
       coffee: number;   // percentage 0-100 (backend key)
       sugar: number;    // percentage 0-100
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
     alerts?: Alert[];
     recentRefills?: Refill[];
   }
   ```

## Adding Features

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

### New Machine Component
1. Create component in `client/components/MyComponent.tsx`
2. Follow existing patterns for data management
3. Use `dataManager` for localStorage persistence
4. Use `apiClient` for backend communication

## Production Deployment

### Frontend Only (Current Setup)
```bash
npm run build
npm run start
```

### With Backend Integration
1. Configure environment variables
2. Deploy frontend build to your hosting service
3. Ensure backend API is accessible from frontend domain

## Architecture Notes

- **Standalone Development**: Complete frontend functionality without backend
- **TypeScript Throughout**: Full type safety across the application
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Offline Support**: LocalStorage persistence for data management
- **Backend Ready**: Easy integration when backend becomes available
- **Real-time Updates**: Immediate UI updates with localStorage sync

## Environment Variables

```bash
# Required
VITE_STANDALONE_MODE=true          # false for backend integration
VITE_API_BASE_URL=http://localhost:8080/api  # Backend API URL

# Optional
VITE_DEBUG=true                    # Enable debug logging
VITE_APP_NAME="Coffee Manager"     # App display name
VITE_APP_VERSION="1.0.0"          # App version
```

## Data Persistence

- **Development**: LocalStorage for all data persistence
- **Production**: LocalStorage + Backend API sync
- **Offline Support**: Automatic fallback to localStorage when backend unavailable
- **Data Sync**: Automatic sync between localStorage and backend when available

This setup ensures the frontend team can work independently while the backend team develops their API, with seamless integration when ready.
