import { RequestHandler } from "express";

// In-memory storage for machine data (in a real app, this would be a database)
const machinesStorage = new Map<string, any>();

// Initialize with some sample data
const initializeData = () => {
  if (machinesStorage.size === 0) {
    // Sample machine data that matches the frontend expectations
    const sampleMachines = [
      {
        id: "1",
        machineId: "VM-001",
        name: "Coffee Machine Alpha",
        location: "Tech Tower",
        office: "Engineering",
        floor: "Floor 3",
        powerStatus: "online",
        status: "operational",
        supplies: {
          coffee: 85,
          water: 92,
          milk: 78,
          sugar: 65,
        },
        usage: { dailyCups: 127, weeklyCups: 890 },
        notes:
          "Machine running smoothly. Recent cleaning completed on schedule.",
        alerts: [
          {
            id: "alert-1",
            type: "maintenance",
            message: "Filter replacement due in 3 days",
            priority: "medium",
            resolved: false,
            timestamp: "2024-01-15T10:30:00Z",
          },
        ],
      },
      {
        id: "2",
        machineId: "VM-002",
        name: "Coffee Machine Beta",
        location: "Tech Tower",
        office: "Engineering",
        floor: "Floor 2",
        powerStatus: "online",
        status: "operational",
        supplies: {
          coffee: 92,
          water: 88,
          milk: 45,
          sugar: 78,
        },
        usage: { dailyCups: 98, weeklyCups: 686 },
        notes: "High performance. Minor calibration needed.",
        alerts: [],
      },
      {
        id: "3",
        machineId: "VM-003",
        name: "Coffee Machine Gamma",
        location: "Tech Tower",
        office: "Engineering",
        floor: "Floor 1",
        powerStatus: "online",
        status: "operational",
        supplies: {
          coffee: 75,
          water: 95,
          milk: 60,
          sugar: 80,
        },
        usage: { dailyCups: 110, weeklyCups: 770 },
        notes: "Newly installed. Running well.",
        alerts: [],
      },
      {
        id: "4",
        machineId: "VM-004",
        name: "Coffee Machine Delta",
        location: "Mumbai BKC",
        office: "Mumbai BKC",
        floor: "Floor 5",
        powerStatus: "online",
        status: "operational",
        supplies: {
          coffee: 68,
          water: 85,
          milk: 45,
          sugar: 70,
        },
        usage: { dailyCups: 95, weeklyCups: 665 },
        notes: "Good performance in Mumbai office.",
        alerts: [
          {
            id: "alert-2",
            type: "supply",
            message: "Milk supply running low",
            priority: "high",
            resolved: false,
            timestamp: "2024-01-16T09:00:00Z",
          },
        ],
      },
    ];

    sampleMachines.forEach((machine) => {
      machinesStorage.set(machine.id, machine);
    });
  }
};

// Initialize data on module load
initializeData();

export const getMachines: RequestHandler = (req, res) => {
  const machines = Array.from(machinesStorage.values());
  res.json(machines);
};

export const getMachine: RequestHandler = (req, res) => {
  const { id } = req.params;
  const machine = machinesStorage.get(id);

  if (!machine) {
    return res.status(404).json({ error: "Machine not found" });
  }

  res.json(machine);
};

export const getMachineByMachineId: RequestHandler = (req, res) => {
  const { machineId } = req.params;
  const machine = Array.from(machinesStorage.values()).find(
    (m) => m.machineId === machineId,
  );

  if (!machine) {
    return res.status(404).json({ error: "Machine not found" });
  }

  res.json(machine);
};

export const updateMachine: RequestHandler = (req, res) => {
  const { id } = req.params;
  const existingMachine = machinesStorage.get(id);

  if (!existingMachine) {
    return res.status(404).json({ error: "Machine not found" });
  }

  // Update the machine data
  const updatedMachine = { ...existingMachine, ...req.body, id };
  machinesStorage.set(id, updatedMachine);

  res.json({
    message: "Machine updated successfully",
    machine: updatedMachine,
  });
};

export const updateSupplies: RequestHandler = (req, res) => {
  const { id } = req.params;
  const existingMachine = machinesStorage.get(id);

  if (!existingMachine) {
    return res.status(404).json({ error: "Machine not found" });
  }

  // Update supplies
  const updatedMachine = {
    ...existingMachine,
    supplies: { ...existingMachine.supplies, ...req.body.supplies },
  };
  machinesStorage.set(id, updatedMachine);

  res.json({ message: "Supplies updated successfully" });
};

export const getLocations: RequestHandler = (req, res) => {
  const machines = Array.from(machinesStorage.values());
  const locations = [...new Set(machines.map((m) => m.location))];
  res.json(locations);
};

export const getOffices: RequestHandler = (req, res) => {
  const { location } = req.query;
  const machines = Array.from(machinesStorage.values());
  let offices = machines.map((m) => m.office);

  if (location) {
    offices = machines
      .filter((m) => m.location === location)
      .map((m) => m.office);
  }

  const uniqueOffices = [...new Set(offices)];
  res.json(uniqueOffices);
};

export const getFloors: RequestHandler = (req, res) => {
  const { location, office } = req.query;
  const machines = Array.from(machinesStorage.values());
  let floors = machines.map((m) => m.floor);

  if (location && office) {
    floors = machines
      .filter((m) => m.location === location && m.office === office)
      .map((m) => m.floor);
  } else if (location) {
    floors = machines
      .filter((m) => m.location === location)
      .map((m) => m.floor);
  } else if (office) {
    floors = machines.filter((m) => m.office === office).map((m) => m.floor);
  }

  const uniqueFloors = [...new Set(floors)];
  res.json(uniqueFloors);
};

export const getMachinesByLocationOfficeFloor: RequestHandler = (req, res) => {
  const { location, office, floor } = req.query;
  let machines = Array.from(machinesStorage.values());

  if (location) {
    machines = machines.filter((m) => m.location === location);
  }
  if (office) {
    machines = machines.filter((m) => m.office === office);
  }
  if (floor) {
    machines = machines.filter((m) => m.floor === floor);
  }

  res.json(machines);
};

export const getLowSupplyMachines: RequestHandler = (req, res) => {
  const machines = Array.from(machinesStorage.values());
  const lowSupplyMachines = machines.filter((machine) => {
    const supplies = machine.supplies;
    return Object.values(supplies).some((level: any) => level < 30);
  });

  res.json(lowSupplyMachines);
};

export const getMaintenanceNeededMachines: RequestHandler = (req, res) => {
  const machines = Array.from(machinesStorage.values());
  const maintenanceMachines = machines.filter((machine) => {
    return (
      machine.status === "maintenance" ||
      (machine.alerts && machine.alerts.some((alert: any) => !alert.resolved))
    );
  });

  res.json(maintenanceMachines);
};
