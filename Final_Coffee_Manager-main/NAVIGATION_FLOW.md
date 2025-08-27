# Navigation Flow Implementation

This document outlines the back button navigation flow that has been implemented for both Admin and Technician users.

## Admin Navigation Hierarchy

```
Dashboard (Pune/Mumbai) → Office List → Machines List → Machine Data Management
```

### Admin Back Button Flow:
1. **Machine Data Management** → Back → **Machines List** (Office Page)
2. **Machines List** → Back → **Office List** (Dashboard - location selection)
3. **Office List** → Back → **Dashboard** (Already implemented)

### Implementation Details:
- **CorporateDashboard.tsx**: Contains the "Sign Out" button for admins
- **OfficeOverview.tsx**: Admin back button goes to `/dashboard` (location selection)
- **MachineManagement.tsx**: Admin back button goes to office page using `officeNameToPath()`

## Technician Navigation Hierarchy

```
Sign In → Machines List → Machine Data Management
```

### Technician Back Button Flow:
1. **Machine Data Management** → Back → **Machines List** (Office Page)
2. **Machines List** → Back → **Sign Out** (Logout function)

### Implementation Details:
- **OfficeOverview.tsx**: Technician back button calls `logout()` function
- **MachineManagement.tsx**: Technician back button goes to office page
- Technicians cannot access the corporate dashboard (location selection)

## Code Changes Made

### 1. OfficeOverview.tsx
```typescript
// Added logout to useAuth hook
const { user, logout } = useAuth();

// Updated InteractiveBreadcrumb with role-based navigation
<InteractiveBreadcrumb
  backUrl={
    user?.role === "admin"
      ? "/dashboard" // Admins go back to location selection
      : undefined // Technicians will use onBack to sign out
  }
  onBack={
    user?.role === "technician"
      ? () => {
          console.log('Technician navigating back: signing out');
          logout();
        }
      : undefined
  }
  className="flex-1"
/>
```

### 2. MachineManagement.tsx
```typescript
// Updated InteractiveBreadcrumb to make admins go to office page
<InteractiveBreadcrumb
  backUrl={
    user?.role === "technician"
      ? (machineId && user?.officeName
          ? `/office/${officeNameToPath(user.officeName)}`
          : "/dashboard")
      : (machineData.office || officePath) 
          ? `/office/${officeNameToPath(machineData.office || pathToOfficeName(officePath || ""))}`
          : "/dashboard" // Fallback if no office info available
  }
  className="flex-1"
/>
```

## Navigation Testing

To test the navigation flow:

### For Admin Users:
1. Sign in as admin → Should land on CorporateDashboard
2. Select location (Pune/Mumbai) → Should show office selection
3. Select office → Should show machines list (OfficeOverview)
4. Click back → Should return to Dashboard (location selection)
5. Select machine → Should show machine details (MachineManagement)
6. Click back → Should return to office page (machines list)

### For Technician Users:
1. Sign in as technician → Should land on their assigned office page
2. Select machine → Should show machine details (MachineManagement)
3. Click back → Should return to office page (machines list)
4. Click back → Should sign them out

## User Role Detection

The navigation logic uses `user?.role` from the AuthContext to determine the appropriate back navigation:
- `"admin"`: Full hierarchy access
- `"technician"`: Limited to their office, back button signs out from office level

## Error Handling

- Fallback navigation to `/dashboard` if office information is not available
- Console logging for debugging navigation actions
- Graceful handling of missing office/user data
