import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MachineManagement from "@/pages/MachineManagement";
import { officeNameToPath, isValidOfficePath } from "@/lib/officeRouting";

/**
 * Office-specific machine management component
 * Validates the office path and ensures users can only access their assigned office
 */
export default function OfficeSpecificMachine() {
  const { officePath } = useParams<{ officePath: string }>();
  const { user } = useAuth();

  // Validate office path exists
  if (!officePath || !isValidOfficePath(officePath)) {
    return <Navigate to="/machine" replace />;
  }

  // For technicians, ensure they can only access their own office
  if (user?.role === "technician" && user.officeName) {
    const userOfficePath = officeNameToPath(user.officeName);
    if (officePath !== userOfficePath) {
      // Redirect to their correct office
      return <Navigate to={`/office/${userOfficePath}`} replace />;
    }
  }

  // Admins can access any office, technicians access their own office
  return <MachineManagement officePath={officePath} />;
}
