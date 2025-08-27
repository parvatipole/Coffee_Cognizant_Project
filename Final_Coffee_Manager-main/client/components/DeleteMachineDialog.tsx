import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Coffee } from "lucide-react";

interface DeleteMachineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  machine: {
    id: string;
    name: string;
    location?: string;
    office?: string;
    floor?: string;
    status: "operational" | "maintenance" | "offline";
  } | null;
  isLoading?: boolean;
}

export default function DeleteMachineDialog({
  isOpen,
  onClose,
  onConfirm,
  machine,
  isLoading = false,
}: DeleteMachineDialogProps) {
  if (!machine) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Machine Permanently
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Are you sure you want to permanently delete this coffee machine? 
              This action cannot be undone.
            </div>
            
            {/* Machine Details Card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Coffee className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{machine.name}</h4>
                  <p className="text-sm text-gray-600 font-mono">{machine.id}</p>
                </div>
                <Badge
                  className={
                    machine.status === "operational"
                      ? "bg-green-100 text-green-700"
                      : machine.status === "maintenance"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                  }
                >
                  {machine.status}
                </Badge>
              </div>
              
              {(machine.location || machine.office || machine.floor) && (
                <div className="text-sm text-gray-600 space-y-1">
                  {machine.location && (
                    <div>Location: <span className="font-medium">{machine.location}</span></div>
                  )}
                  {machine.office && (
                    <div>Office: <span className="font-medium">{machine.office}</span></div>
                  )}
                  {machine.floor && (
                    <div>Floor: <span className="font-medium">{machine.floor}</span></div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <div className="font-medium mb-1">This will permanently:</div>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Remove all machine data and history</li>
                    <li>Delete all usage and maintenance records</li>
                    <li>Remove any pending alerts or notifications</li>
                    <li>Make the machine unavailable to all users</li>
                  </ul>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isLoading ? "Deleting..." : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
