import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getMachines,
  getMachine,
  getMachineByMachineId,
  updateMachine,
  updateSupplies,
  getLocations,
  getOffices,
  getFloors,
  getMachinesByLocationOfficeFloor,
  getLowSupplyMachines,
  getMaintenanceNeededMachines,
} from "./routes/machines";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Machine API routes (specific routes first to avoid conflicts)
  app.get("/api/machines/locations", getLocations);
  app.get("/api/machines/offices", getOffices);
  app.get("/api/machines/floors", getFloors);
  app.get("/api/machines/by-location", getMachinesByLocationOfficeFloor);
  app.get("/api/machines/low-supply", getLowSupplyMachines);
  app.get("/api/machines/maintenance-needed", getMaintenanceNeededMachines);
  app.get("/api/machines/machine/:machineId", getMachineByMachineId);
  app.get("/api/machines", getMachines);
  app.get("/api/machines/:id", getMachine);
  app.put("/api/machines/:id", updateMachine);
  app.put("/api/machines/:id/supplies", updateSupplies);

  return app;
}
