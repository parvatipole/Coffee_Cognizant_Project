package com.coffee.coffeeApp.controller;

import com.coffee.coffeeApp.entity.Machine;
import com.coffee.coffeeApp.repository.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/machines")
@CrossOrigin(origins = "http://localhost:8080")
public class MachineController {
    
    @Autowired
    private MachineRepository machineRepository;
    
    @GetMapping
    public ResponseEntity<List<Machine>> getAllMachines() {
        List<Machine> machines = machineRepository.findAll();
        return ResponseEntity.ok(machines);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getMachineById(@PathVariable Long id) {
        Optional<Machine> machine = machineRepository.findById(id);
        if (machine.isPresent()) {
            return ResponseEntity.ok(machine.get());
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Machine not found");
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/machine/{machineId}")
    public ResponseEntity<?> getMachineByMachineId(@PathVariable String machineId) {
        Optional<Machine> machine = machineRepository.findByMachineId(machineId);
        if (machine.isPresent()) {
            return ResponseEntity.ok(machine.get());
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Machine not found");
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMachine(@PathVariable Long id, @RequestBody Machine machineDetails) {
        Optional<Machine> machineOptional = machineRepository.findById(id);
        if (machineOptional.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Machine not found");
            return ResponseEntity.notFound().build();
        }
        
        Machine machine = machineOptional.get();
        
        if (machineDetails.getName() != null) {
            machine.setName(machineDetails.getName());
        }
        if (machineDetails.getLocation() != null) {
            machine.setLocation(machineDetails.getLocation());
        }
        if (machineDetails.getOffice() != null) {
            machine.setOffice(machineDetails.getOffice());
        }
        if (machineDetails.getFloor() != null) {
            machine.setFloor(machineDetails.getFloor());
        }
        if (machineDetails.getStatus() != null) {
            machine.setStatus(machineDetails.getStatus());
        }
        if (machineDetails.getSupplies() != null) {
            machine.setSupplies(machineDetails.getSupplies());
        }
        if (machineDetails.getAlerts() != null) {
            machine.setAlerts(machineDetails.getAlerts());
        }
        if (machineDetails.getLastMaintenance() != null) {
            machine.setLastMaintenance(machineDetails.getLastMaintenance());
        }
        
        Machine updatedMachine = machineRepository.save(machine);
        return ResponseEntity.ok(updatedMachine);
    }
    
    @PutMapping("/{id}/supplies")
    public ResponseEntity<?> updateMachineSupplies(@PathVariable Long id, @RequestBody Map<String, Integer> supplies) {
        Optional<Machine> machineOptional = machineRepository.findById(id);
        if (machineOptional.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Machine not found");
            return ResponseEntity.notFound().build();
        }
        
        Machine machine = machineOptional.get();
        
        Map<String, Integer> currentSupplies = machine.getSupplies();
        if (currentSupplies == null) {
            currentSupplies = new HashMap<>();
        }
        
        currentSupplies.putAll(supplies);
        machine.setSupplies(currentSupplies);
        
        Machine updatedMachine = machineRepository.save(machine);
        return ResponseEntity.ok(updatedMachine);
    }
    
    @GetMapping("/locations")
    public ResponseEntity<List<String>> getLocations() {
        List<String> locations = machineRepository.findDistinctLocations();
        return ResponseEntity.ok(locations);
    }
    
    @GetMapping("/offices")
    public ResponseEntity<List<String>> getOffices(@RequestParam String location) {
        List<String> offices = machineRepository.findDistinctOfficesByLocation(location);
        return ResponseEntity.ok(offices);
    }
    
    @GetMapping("/floors")
    public ResponseEntity<List<String>> getFloors(@RequestParam String location, @RequestParam String office) {
        List<String> floors = machineRepository.findDistinctFloorsByLocationAndOffice(location, office);
        return ResponseEntity.ok(floors);
    }
    
    @GetMapping("/by-location-office-floor")
    public ResponseEntity<List<Machine>> getMachinesByLocationOfficeFloor(
            @RequestParam String location,
            @RequestParam String office,
            @RequestParam String floor) {
        List<Machine> machines = machineRepository.findByLocationAndOfficeAndFloor(location, office, floor);
        return ResponseEntity.ok(machines);
    }
    
    @GetMapping("/low-supplies")
    public ResponseEntity<List<Machine>> getLowSupplyMachines(@RequestParam(defaultValue = "30") int threshold) {
        List<Machine> allMachines = machineRepository.findAll();
        List<Machine> lowSupplyMachines = allMachines.stream()
                .filter(machine -> {
                    Map<String, Integer> supplies = machine.getSupplies();
                    if (supplies == null || supplies.isEmpty()) {
                        return false;
                    }
                    return supplies.values().stream().anyMatch(level -> level < threshold);
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(lowSupplyMachines);
    }
    
    @GetMapping("/maintenance-needed")
    public ResponseEntity<List<Machine>> getMaintenanceNeededMachines() {
        List<Machine> allMachines = machineRepository.findAll();
        List<Machine> maintenanceMachines = allMachines.stream()
                .filter(machine -> {
                    if ("maintenance".equals(machine.getStatus())) {
                        return true;
                    }
                    List<String> alerts = machine.getAlerts();
                    return alerts != null && !alerts.isEmpty();
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(maintenanceMachines);
    }
}
