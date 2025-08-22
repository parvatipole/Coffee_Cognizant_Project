// Utility functions for office-specific routing

/**
 * Converts office name to URL-friendly path
 */
export function officeNameToPath(officeName: string): string {
  return officeName
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-z0-9\-]/g, "") // Remove special characters except dashes
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

/**
 * Mapping of office paths to actual office names for accurate reverse lookup
 */
const OFFICE_PATH_TO_NAME: Record<string, string> = {
  "hinjewadi-it-park": "Hinjewadi IT Park",
  "koregaon-park-corporate": "Koregaon Park Corporate",
  "viman-nagar-tech-hub": "Viman Nagar Tech Hub",
  "bandra-kurla-complex": "Bandra Kurla Complex",
  "lower-parel-financial": "Lower Parel Financial",
  "andheri-tech-center": "Andheri Tech Center",
};

/**
 * Converts URL path back to office name
 */
export function pathToOfficeName(path: string): string {
  return (
    OFFICE_PATH_TO_NAME[path] ||
    path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

/**
 * Available offices from signup - matching admin dashboard
 */
export const OFFICE_LOCATIONS = {
  pune: [
    "Hinjewadi IT Park",
    "Koregaon Park Corporate",
    "Viman Nagar Tech Hub",
  ],
  mumbai: [
    "Bandra Kurla Complex",
    "Lower Parel Financial",
    "Andheri Tech Center",
  ],
} as const;

/**
 * Get all available office paths
 */
export function getAllOfficePaths(): string[] {
  const allOffices = [...OFFICE_LOCATIONS.pune, ...OFFICE_LOCATIONS.mumbai];
  return allOffices.map(officeNameToPath);
}

/**
 * Check if a path corresponds to a valid office
 */
export function isValidOfficePath(path: string): boolean {
  return getAllOfficePaths().includes(path);
}
