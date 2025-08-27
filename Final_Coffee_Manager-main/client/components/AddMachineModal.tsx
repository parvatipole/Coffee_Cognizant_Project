import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  MACHINE_STATUS,
  FILTER_STATUS,
  CLEANING_STATUS,
  SUPPLY_TYPES,
  SUPPLY_NAMES,
  SUPPLY_DEFAULTS,
  VALIDATION
} from '@/config';
import { ALL_STRINGS } from '@/config/ui-strings';
import { getAllOfficeNames } from '@/config/machines';

interface MachineFormData {
  name: string;
  location: string;
  office: string;
  status: typeof MACHINE_STATUS[keyof typeof MACHINE_STATUS];
  supplies: {
    [SUPPLY_TYPES.WATER]: number;
    [SUPPLY_TYPES.MILK]: number;
    [SUPPLY_TYPES.COFFEE_BEANS]: number;
    [SUPPLY_TYPES.SUGAR]: number;
  };
  maintenance: {
    filterStatus: typeof FILTER_STATUS[keyof typeof FILTER_STATUS];
    cleaningStatus: typeof CLEANING_STATUS[keyof typeof CLEANING_STATUS];
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
  const [formData, setFormData] = useState<MachineFormData>({
    name: '',
    location: '',
    office: selectedOffice || '',
    status: MACHINE_STATUS.OPERATIONAL,
    supplies: {
      [SUPPLY_TYPES.WATER]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
      [SUPPLY_TYPES.MILK]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
      [SUPPLY_TYPES.COFFEE_BEANS]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
      [SUPPLY_TYPES.SUGAR]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
    },
    maintenance: {
      filterStatus: FILTER_STATUS.GOOD,
      cleaningStatus: CLEANING_STATUS.CLEAN,
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
      setFormData({
        name: '',
        location: '',
        office: selectedOffice || '',
        status: MACHINE_STATUS.OPERATIONAL,
        supplies: {
          [SUPPLY_TYPES.WATER]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
          [SUPPLY_TYPES.MILK]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
          [SUPPLY_TYPES.COFFEE_BEANS]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
          [SUPPLY_TYPES.SUGAR]: SUPPLY_DEFAULTS.DEFAULT_LEVEL,
        },
        maintenance: {
          filterStatus: FILTER_STATUS.GOOD,
          cleaningStatus: CLEANING_STATUS.CLEAN,
          pressure: 15,
        },
        notes: '',
      });
    }
  }, [isOpen, selectedOffice]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-primary" />
            {ALL_STRINGS.MACHINE.ADD_MACHINE}
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
                <Label htmlFor="name">{ALL_STRINGS.MACHINE.MACHINE_NAME} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={ALL_STRINGS.MACHINE.MACHINE_NAME_PLACEHOLDER}
                  required
                  maxLength={VALIDATION.MACHINE_NAME_MAX_LENGTH}
                />
              </div>

              {!selectedOffice && (
                <div className="space-y-2">
                  <Label htmlFor="office">{ALL_STRINGS.MACHINE.OFFICE} *</Label>
                  <Select
                    value={formData.office}
                    onValueChange={(value) => handleInputChange('office', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={ALL_STRINGS.MACHINE.OFFICE_PLACEHOLDER} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAllOfficeNames().map((officeName) => (
                        <SelectItem key={officeName} value={officeName}>
                          {officeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedOffice && (
                <div className="space-y-2">
                  <Label htmlFor="office">{ALL_STRINGS.MACHINE.OFFICE}</Label>
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
              <Label htmlFor="location">{ALL_STRINGS.MACHINE.LOCATION} *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={ALL_STRINGS.MACHINE.LOCATION_PLACEHOLDER}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: typeof MACHINE_STATUS[keyof typeof MACHINE_STATUS]) =>
                  handleInputChange('status', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MACHINE_STATUS.OPERATIONAL}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      {ALL_STRINGS.MACHINE.STATUS_OPERATIONAL}
                    </div>
                  </SelectItem>
                  <SelectItem value={MACHINE_STATUS.MAINTENANCE}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      {ALL_STRINGS.MACHINE.STATUS_MAINTENANCE}
                    </div>
                  </SelectItem>
                  <SelectItem value={MACHINE_STATUS.OFFLINE}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      {ALL_STRINGS.MACHINE.STATUS_OFFLINE}
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
              {ALL_STRINGS.MACHINE.SUPPLY_LEVELS} ({ALL_STRINGS.UI.PERCENT})
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData.supplies).map(([supply, value]) => (
                <div key={supply} className="space-y-2">
                  <Label htmlFor={supply}>
                    {SUPPLY_NAMES[supply as keyof typeof SUPPLY_NAMES] || supply}
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
              {ALL_STRINGS.MACHINE.MAINTENANCE} Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filterStatus">{ALL_STRINGS.MACHINE.FILTER_STATUS}</Label>
                <Select
                  value={formData.maintenance.filterStatus}
                  onValueChange={(value: typeof FILTER_STATUS[keyof typeof FILTER_STATUS]) =>
                    handleMaintenanceChange('filterStatus', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FILTER_STATUS.GOOD}>{ALL_STRINGS.MACHINE.FILTER_GOOD}</SelectItem>
                    <SelectItem value={FILTER_STATUS.NEEDS_REPLACEMENT}>{ALL_STRINGS.MACHINE.FILTER_NEEDS_REPLACEMENT}</SelectItem>
                    <SelectItem value={FILTER_STATUS.CRITICAL}>{ALL_STRINGS.MACHINE.FILTER_CRITICAL}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleaningStatus">{ALL_STRINGS.MACHINE.CLEANING_STATUS}</Label>
                <Select
                  value={formData.maintenance.cleaningStatus}
                  onValueChange={(value: typeof CLEANING_STATUS[keyof typeof CLEANING_STATUS]) =>
                    handleMaintenanceChange('cleaningStatus', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CLEANING_STATUS.CLEAN}>{ALL_STRINGS.MACHINE.CLEANING_CLEAN}</SelectItem>
                    <SelectItem value={CLEANING_STATUS.NEEDS_CLEANING}>{ALL_STRINGS.MACHINE.CLEANING_NEEDS_CLEANING}</SelectItem>
                    <SelectItem value={CLEANING_STATUS.OVERDUE}>{ALL_STRINGS.MACHINE.CLEANING_OVERDUE}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressure">{ALL_STRINGS.MACHINE.PRESSURE} (bar)</Label>
                <Input
                  id="pressure"
                  type="number"
                  min={SUPPLY_DEFAULTS.MIN_PRESSURE}
                  max={SUPPLY_DEFAULTS.MAX_PRESSURE}
                  value={formData.maintenance.pressure}
                  onChange={(e) => handleMaintenanceChange('pressure', parseInt(e.target.value) || 15)}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Installation {ALL_STRINGS.MACHINE.NOTES}</h3>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder={ALL_STRINGS.MACHINE.NOTES_PLACEHOLDER}
              className="min-h-[80px]"
              maxLength={VALIDATION.NOTES_MAX_LENGTH}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.notes.length}/{VALIDATION.NOTES_MAX_LENGTH}
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              {ALL_STRINGS.FORM.CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isLoading ? ALL_STRINGS.FORM.SAVING : ALL_STRINGS.MACHINE.ADD_MACHINE}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
