package com.coffee.coffeeApp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "machines")
public class Machine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true)
    private String machineId;
    
    @NotBlank
    private String name;
    
    @NotBlank
    private String location;
    
    @NotBlank
    private String office;
    
    @NotBlank
    private String floor;
    
    private String status;
    
    @ElementCollection
    @CollectionTable(name = "machine_supplies", joinColumns = @JoinColumn(name = "machine_id"))
    @MapKeyColumn(name = "supply_name")
    @Column(name = "supply_level")
    private Map<String, Integer> supplies;
    
    @ElementCollection
    @CollectionTable(name = "machine_alerts", joinColumns = @JoinColumn(name = "machine_id"))
    @Column(name = "alert")
    private java.util.List<String> alerts;
    
    private LocalDateTime lastMaintenance;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public Machine() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Machine(String machineId, String name, String location, String office, String floor) {
        this();
        this.machineId = machineId;
        this.name = name;
        this.location = location;
        this.office = office;
        this.floor = floor;
        this.status = "operational";
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getMachineId() {
        return machineId;
    }
    
    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getOffice() {
        return office;
    }
    
    public void setOffice(String office) {
        this.office = office;
    }
    
    public String getFloor() {
        return floor;
    }
    
    public void setFloor(String floor) {
        this.floor = floor;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public Map<String, Integer> getSupplies() {
        return supplies;
    }
    
    public void setSupplies(Map<String, Integer> supplies) {
        this.supplies = supplies;
        this.updatedAt = LocalDateTime.now();
    }
    
    public java.util.List<String> getAlerts() {
        return alerts;
    }
    
    public void setAlerts(java.util.List<String> alerts) {
        this.alerts = alerts;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getLastMaintenance() {
        return lastMaintenance;
    }
    
    public void setLastMaintenance(LocalDateTime lastMaintenance) {
        this.lastMaintenance = lastMaintenance;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
