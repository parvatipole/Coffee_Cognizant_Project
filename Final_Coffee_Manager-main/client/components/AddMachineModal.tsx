import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useErrorSuppression } from '@/hooks/useErrorSuppression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Coffee, MapPin, Building, Zap } from 'lucide-react';

interface MachineFormData {
  name: string;
  location: string;
  office: string;
  status: 'operational' | 'maintenance' | 'offline';
  supplies: {
    water: number;
    milk: number;
    coffeeBeans: number;
    sugar: number;
  };
  maintenance: {
    filterStatus: 'good' | 'needs_replacement' | 'critical';
    cleaningStatus: 'clean' | 'needs_cleaning' | 'overdue';
    temperature: number;
    pressure: number;
  };
  notes: string;
}

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (machineData: MachineFormData) => void;
  selectedOffice?: string;
  isLoading?: boolean;
}

export default function AddMachineModal({
  isOpen,
  onClose,
  onSubmit,
  selectedOffice,
  isLoading = false,
}: AddMachineModalProps) {
  // Suppress third-party script errors (like video element errors)
  useErrorSuppression();

  const [formData, setFormData] = useState<MachineFormData>({
    name: '',
    location: '',
    office: selectedOffice || '',
    status: 'operational',
    supplies: {
      water: 100,
      milk: 100,
      coffeeBeans: 100,
      sugar: 100,
    },
    maintenance: {
      filterStatus: 'good',
      cleaningStatus: 'clean',
      temperature: 92,
      pressure: 15,
    },
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use selectedOffice if provided, otherwise use form data
      const finalFormData = {
        ...formData,
        office: selectedOffice || formData.office,
      };

      await onSubmit(finalFormData);
    } catch (error) {
      console.error('Failed to add machine:', error);
    }
  };


  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSupplyChange = (supply: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      supplies: {
        ...prev.supplies,
        [supply]: Math.max(0, Math.min(100, value)),
      },
    }));
  };

  const handleMaintenanceChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      maintenance: {
        ...prev.maintenance,
        [field]: value,
      },
    }));
  };

  const isFormValid = formData.name.trim() && formData.location.trim() && (formData.office.trim() || selectedOffice);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Modal opened - resetting form with selectedOffice:', selectedOffice);
      setFormData({
        name: '',
        location: '',
        office: selectedOffice || '',
        status: 'operational',
        supplies: {
          water: 100,
          milk: 100,
          coffeeBeans: 100,
          sugar: 100,
        },
        maintenance: {
          filterStatus: 'good',
          cleaningStatus: 'clean',
          temperature: 92,
          pressure: 15,
        },
        notes: '',
      });
    }
  }, [isOpen, selectedOffice]);

  // Only log validation issues when form is invalid
  useEffect(() => {
    if (!isFormValid && (formData.name || formData.location || formData.office)) {
      console.log('📋 Form validation issues:', {
        nameValid: !!formData.name.trim(),
        locationValid: !!formData.location.trim(),
        officeValid: !!(formData.office.trim() || selectedOffice),
      });
    }
  }, [formData.name, formData.location, formData.office, selectedOffice, isFormValid]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-primary" />
            Add New Coffee Machine
          </DialogTitle>
          <DialogDescription>
            {selectedOffice
              ? `Configure a new coffee machine for ${selectedOffice}. Fill in all the required details.`
              : 'Configure a new coffee machine. Fill in all the required details.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="w-4 h-4" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Machine Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Coffee Station Alpha"
                  required
                />
              </div>

              {!selectedOffice && (
                <div className="space-y-2">
                  <Label htmlFor="office">Office *</Label>
                  <Input
                    id="office"
                    value={formData.office}
                    onChange={(e) => handleInputChange('office', e.target.value)}
                    placeholder="e.g., Hinjewadi IT Park"
                    required
                  />
                </div>
              )}

              {selectedOffice && (
                <div className="space-y-2">
                  <Label htmlFor="office">Office</Label>
                  <Input
                    id="office"
                    value={selectedOffice}
                    disabled
                    className="bg-muted text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    Machine will be added to {selectedOffice}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Specific Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Building A2, Ground Floor"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'operational' | 'maintenance' | 'offline') =>
                  handleInputChange('status', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Operational
                    </div>
                  </SelectItem>
                  <SelectItem value="maintenance">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Maintenance
                    </div>
                  </SelectItem>
                  <SelectItem value="offline">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Offline
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Supply Levels */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Initial Supply Levels (%)
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData.supplies).map(([supply, value]) => (
                <div key={supply} className="space-y-2">
                  <Label htmlFor={supply}>
                    {supply === 'coffeeBeans' ? 'Coffee Beans' : supply.charAt(0).toUpperCase() + supply.slice(1)}
                  </Label>
                  <Input
                    id={supply}
                    type="number"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleSupplyChange(supply, parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Maintenance Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filterStatus">Filter Status</Label>
                <Select
                  value={formData.maintenance.filterStatus}
                  onValueChange={(value: 'good' | 'needs_replacement' | 'critical') =>
                    handleMaintenanceChange('filterStatus', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="needs_replacement">Needs Replacement</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleaningStatus">Cleaning Status</Label>
                <Select
                  value={formData.maintenance.cleaningStatus}
                  onValueChange={(value: 'clean' | 'needs_cleaning' | 'overdue') =>
                    handleMaintenanceChange('cleaningStatus', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clean">Clean</SelectItem>
                    <SelectItem value="needs_cleaning">Needs Cleaning</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Operating Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="80"
                  max="100"
                  value={formData.maintenance.temperature}
                  onChange={(e) => handleMaintenanceChange('temperature', parseInt(e.target.value) || 92)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressure">Operating Pressure (bar)</Label>
                <Input
                  id="pressure"
                  type="number"
                  min="10"
                  max="20"
                  value={formData.maintenance.pressure}
                  onChange={(e) => handleMaintenanceChange('pressure', parseInt(e.target.value) || 15)}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Installation Notes</h3>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any installation notes, special instructions, or observations..."
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isLoading ? 'Adding Machine...' : 'Add Machine'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
