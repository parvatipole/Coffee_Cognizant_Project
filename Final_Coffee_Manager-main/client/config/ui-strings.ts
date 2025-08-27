// UI Strings and Messages Configuration
// Centralized text content for internationalization and easy maintenance

// ========================================
// AUTHENTICATION STRINGS
// ========================================
export const AUTH_STRINGS = {
  // Login page
  LOGIN_WELCOME: "Welcome Back",
  LOGIN_SUBTITLE: "Sign in to your coffee management account",
  USERNAME_LABEL: "Username",
  USERNAME_PLACEHOLDER: "Enter your username",
  PASSWORD_LABEL: "Password", 
  PASSWORD_PLACEHOLDER: "Enter your password",
  SIGN_IN_BUTTON: "Sign In",
  CREATE_ACCOUNT_LINK: "Create Account",
  FORGOT_PASSWORD_LINK: "Forgot Password?",
  
  // Signup page
  SIGNUP_WELCOME: "Create Account",
  SIGNUP_SUBTITLE: "Join the coffee management system",
  NAME_LABEL: "Full Name",
  NAME_PLACEHOLDER: "Enter your full name",
  CONFIRM_PASSWORD_LABEL: "Confirm Password",
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm your password",
  ROLE_LABEL: "Role",
  ROLE_PLACEHOLDER: "Select your role",
  CITY_LABEL: "City",
  CITY_PLACEHOLDER: "Select your city",
  OFFICE_LABEL: "Office",
  OFFICE_PLACEHOLDER: "Select your office",
  CREATE_ACCOUNT_BUTTON: "Create Account",
  ALREADY_HAVE_ACCOUNT: "Already have an account?",
  SIGN_IN_LINK: "Sign In",
  
  // Role options
  ROLE_TECHNICIAN: "Technician",
  ROLE_ADMIN: "Administrator",
  
  // Auth messages
  LOGIN_SUCCESS: "Successfully logged in",
  LOGOUT_SUCCESS: "Successfully logged out", 
  SIGNUP_SUCCESS: "Account created successfully",
  INVALID_CREDENTIALS: "Invalid username or password",
  ACCOUNT_EXISTS: "Account already exists",
  FIELDS_REQUIRED: "Please fill in all required fields",
} as const;

// ========================================
// NAVIGATION STRINGS
// ========================================
export const NAV_STRINGS = {
  HOME: "Home",
  DASHBOARD: "Dashboard",
  MACHINES: "Machines",
  ALERTS: "Alerts",
  REPORTS: "Reports", 
  SETTINGS: "Settings",
  PROFILE: "Profile",
  LOGOUT: "Logout",
  BACK: "Back",
  MENU: "Menu",
  CLOSE: "Close",
} as const;

// ========================================
// MACHINE MANAGEMENT STRINGS
// ========================================
export const MACHINE_STRINGS = {
  // General
  MACHINE: "Machine",
  MACHINES: "Machines",
  MACHINE_DETAILS: "Machine Details",
  MACHINE_STATUS: "Machine Status",
  MACHINE_OVERVIEW: "Machine Overview",
  
  // Status labels
  STATUS_OPERATIONAL: "Operational",
  STATUS_MAINTENANCE: "Maintenance",
  STATUS_OFFLINE: "Offline",
  
  POWER_ONLINE: "Online",
  POWER_OFFLINE: "Offline",
  
  ELECTRICITY_AVAILABLE: "Available", 
  ELECTRICITY_UNAVAILABLE: "Unavailable",
  
  // Supply management
  SUPPLIES: "Supplies",
  SUPPLY_LEVELS: "Supply Levels",
  REFILL_SUPPLIES: "Refill Supplies",
  RECENT_REFILLS: "Recent Refills",
  WATER_TANK: "Water Tank",
  MILK_CONTAINER: "Milk Container",
  COFFEE_BEANS: "Coffee Beans",
  SUGAR_CONTAINER: "Sugar Container",
  
  // Actions
  EDIT_MACHINE: "Edit Machine",
  SAVE_CHANGES: "Save Changes",
  CANCEL_CHANGES: "Cancel",
  ADD_MACHINE: "Add Machine",
  DELETE_MACHINE: "Delete Machine",
  REFRESH_DATA: "Refresh Data",
  
  // Forms
  MACHINE_NAME: "Machine Name",
  MACHINE_NAME_PLACEHOLDER: "e.g., Coffee Station Alpha",
  LOCATION: "Location",
  LOCATION_PLACEHOLDER: "e.g., Building A2, Ground Floor",
  OFFICE: "Office",
  OFFICE_PLACEHOLDER: "e.g., Hinjewadi IT Park",
  FLOOR: "Floor",
  FLOOR_PLACEHOLDER: "e.g., Floor 3",
  NOTES: "Notes",
  NOTES_PLACEHOLDER: "Add any notes or observations...",
  
  // Maintenance
  MAINTENANCE: "Maintenance",
  LAST_MAINTENANCE: "Last Maintenance",
  NEXT_MAINTENANCE: "Next Maintenance",
  FILTER_STATUS: "Filter Status",
  CLEANING_STATUS: "Cleaning Status",
  PRESSURE: "Pressure",
  
  FILTER_GOOD: "Good",
  FILTER_NEEDS_REPLACEMENT: "Needs Replacement",
  FILTER_CRITICAL: "Critical",
  
  CLEANING_CLEAN: "Clean",
  CLEANING_NEEDS_CLEANING: "Needs Cleaning", 
  CLEANING_OVERDUE: "Overdue",
  
  // Usage statistics
  USAGE: "Usage",
  DAILY_CUPS: "Daily Cups",
  WEEKLY_CUPS: "Weekly Cups",
  MONTHLY_CUPS: "Monthly Cups",
} as const;

// ========================================
// ALERT STRINGS
// ========================================
export const ALERT_STRINGS = {
  // General
  ALERTS: "Alerts",
  ALERT: "Alert",
  NO_ALERTS: "No active alerts",
  VIEW_ALL_ALERTS: "View All Alerts",
  ACTIVE_ALERTS: "Active Alerts",
  RESOLVED_ALERTS: "Resolved Alerts",
  
  // Actions
  MARK_RESOLVED: "Mark as Resolved",
  DISMISS_ALERT: "Dismiss",
  RESOLVE_ALL: "Resolve All",
  
  // Alert types
  LOW_SUPPLY_ALERT: "Low Supply Alert",
  MAINTENANCE_ALERT: "Maintenance Required",
  POWER_OUTAGE_ALERT: "Power Outage",
  FILTER_REPLACEMENT_ALERT: "Filter Replacement Required",
  CLEANING_ALERT: "Cleaning Required",
  
  // Alert descriptions
  LOW_WATER: "Water level is running low",
  LOW_MILK: "Milk level is running low",
  LOW_COFFEE: "Coffee beans level is running low",
  LOW_SUGAR: "Sugar level is running low",
  FILTER_REPLACEMENT_REQUIRED: "Water filter needs replacement",
  CLEANING_REQUIRED: "Machine requires cleaning",
  POWER_OUTAGE: "Machine has lost power",
  MAINTENANCE_DUE: "Scheduled maintenance is due",
  
  // Alert priorities
  PRIORITY_LOW: "Low",
  PRIORITY_MEDIUM: "Medium", 
  PRIORITY_HIGH: "High",
  PRIORITY_CRITICAL: "Critical",
} as const;

// ========================================
// FORM STRINGS
// ========================================
export const FORM_STRINGS = {
  // General actions
  SAVE: "Save",
  CANCEL: "Cancel",
  SUBMIT: "Submit",
  RESET: "Reset", 
  EDIT: "Edit",
  DELETE: "Delete",
  ADD: "Add",
  UPDATE: "Update",
  CONFIRM: "Confirm",
  
  // Validation
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  INVALID_NUMBER: "Please enter a valid number",
  VALUE_TOO_LOW: "Value is too low",
  VALUE_TOO_HIGH: "Value is too high",
  
  // Form states
  LOADING: "Loading...",
  SAVING: "Saving...", 
  SAVED: "Saved",
  ERROR: "Error",
  SUCCESS: "Success",
} as const;

// ========================================
// DASHBOARD STRINGS
// ========================================
export const DASHBOARD_STRINGS = {
  WELCOME: "Welcome to Coffee Manager",
  DASHBOARD_OVERVIEW: "Dashboard Overview",
  MACHINE_SUMMARY: "Machine Summary",
  ALERT_SUMMARY: "Alert Summary",
  RECENT_ACTIVITY: "Recent Activity",
  QUICK_ACTIONS: "Quick Actions",
  
  // Stats
  TOTAL_MACHINES: "Total Machines",
  OPERATIONAL_MACHINES: "Operational",
  MAINTENANCE_MACHINES: "In Maintenance",
  OFFLINE_MACHINES: "Offline",
  
  TOTAL_ALERTS: "Total Alerts",
  CRITICAL_ALERTS: "Critical",
  WARNING_ALERTS: "Warnings",
  
  // Time periods
  TODAY: "Today",
  THIS_WEEK: "This Week",
  THIS_MONTH: "This Month",
  LAST_24_HOURS: "Last 24 Hours",
} as const;

// ========================================
// GENERAL UI STRINGS
// ========================================
export const UI_STRINGS = {
  // Common actions
  OK: "OK",
  YES: "Yes",
  NO: "No",
  CONTINUE: "Continue",
  CANCEL: "Cancel",
  CLOSE: "Close",
  SEARCH: "Search",
  FILTER: "Filter",
  SORT: "Sort",
  REFRESH: "Refresh",
  
  // States
  LOADING: "Loading...",
  ERROR: "Error",
  SUCCESS: "Success",
  WARNING: "Warning",
  INFO: "Information",
  EMPTY: "No data available",
  
  // Time
  NOW: "Now",
  JUST_NOW: "Just now",
  MINUTES_AGO: (n: number) => `${n} minute${n !== 1 ? 's' : ''} ago`,
  HOURS_AGO: (n: number) => `${n} hour${n !== 1 ? 's' : ''} ago`,
  DAYS_AGO: (n: number) => `${n} day${n !== 1 ? 's' : ''} ago`,
  
  // Units
  PERCENT: "%",
  PSI: "PSI",
  CUPS: "cups",
  LITERS: "L",
  MILLILITERS: "mL",
  
  // File operations
  UPLOAD: "Upload",
  DOWNLOAD: "Download",
  EXPORT: "Export",
  IMPORT: "Import",
} as const;

// ========================================
// ERROR STRINGS
// ========================================
export const ERROR_STRINGS = {
  // Network errors
  NETWORK_ERROR: "Network connection failed",
  SERVER_ERROR: "Server error occurred",
  TIMEOUT_ERROR: "Request timed out",
  
  // Authentication errors
  AUTH_REQUIRED: "Authentication required",
  ACCESS_DENIED: "Access denied",
  SESSION_EXPIRED: "Session has expired",
  
  // Validation errors
  INVALID_INPUT: "Invalid input provided",
  MISSING_REQUIRED_FIELDS: "Please fill in all required fields",
  INVALID_FORMAT: "Invalid format",
  
  // Machine errors
  MACHINE_NOT_FOUND: "Machine not found",
  MACHINE_OFFLINE: "Machine is currently offline",
  COMMUNICATION_ERROR: "Communication error with machine",
  
  // Data errors
  SAVE_FAILED: "Failed to save data",
  LOAD_FAILED: "Failed to load data",
  DELETE_FAILED: "Failed to delete item",
  UPDATE_FAILED: "Failed to update data",
  
  // Generic
  UNKNOWN_ERROR: "An unknown error occurred",
  TRY_AGAIN: "Please try again",
  CONTACT_SUPPORT: "Please contact support if the problem persists",
} as const;

// ========================================
// SUCCESS STRINGS
// ========================================
export const SUCCESS_STRINGS = {
  SAVE_SUCCESS: "Data saved successfully",
  UPDATE_SUCCESS: "Updated successfully",
  DELETE_SUCCESS: "Deleted successfully", 
  UPLOAD_SUCCESS: "Upload completed successfully",
  SYNC_SUCCESS: "Data synchronized successfully",
  OPERATION_SUCCESS: "Operation completed successfully",
} as const;

// ========================================
// CONFIRMATION STRINGS
// ========================================
export const CONFIRMATION_STRINGS = {
  DELETE_MACHINE: "Are you sure you want to delete this machine?",
  DELETE_ALERT: "Are you sure you want to delete this alert?",
  RESET_DATA: "Are you sure you want to reset all data?",
  LOGOUT_CONFIRM: "Are you sure you want to log out?",
  UNSAVED_CHANGES: "You have unsaved changes. Are you sure you want to leave?",
  DISCARD_CHANGES: "Discard changes?",
} as const;

// ========================================
// EXPORT ALL STRINGS
// ========================================
export const ALL_STRINGS = {
  AUTH: AUTH_STRINGS,
  NAV: NAV_STRINGS,
  MACHINE: MACHINE_STRINGS,
  ALERT: ALERT_STRINGS,
  FORM: FORM_STRINGS,
  DASHBOARD: DASHBOARD_STRINGS,
  UI: UI_STRINGS,
  ERROR: ERROR_STRINGS,
  SUCCESS: SUCCESS_STRINGS,
  CONFIRMATION: CONFIRMATION_STRINGS,
} as const;

export default ALL_STRINGS;
