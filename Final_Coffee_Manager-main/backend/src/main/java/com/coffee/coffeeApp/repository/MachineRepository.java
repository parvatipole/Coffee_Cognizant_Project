package com.coffee.coffeeApp.repository;

import com.coffee.coffeeApp.entity.Machine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    
    Optional<Machine> findByMachineId(String machineId);
    
    List<Machine> findByLocation(String location);
    
    List<Machine> findByLocationAndOffice(String location, String office);
    
    List<Machine> findByLocationAndOfficeAndFloor(String location, String office, String floor);
    
    List<Machine> findByStatus(String status);
    
    @Query("SELECT DISTINCT m.location FROM Machine m")
    List<String> findDistinctLocations();
    
    @Query("SELECT DISTINCT m.office FROM Machine m WHERE m.location = :location")
    List<String> findDistinctOfficesByLocation(@Param("location") String location);
    
    @Query("SELECT DISTINCT m.floor FROM Machine m WHERE m.location = :location AND m.office = :office")
    List<String> findDistinctFloorsByLocationAndOffice(@Param("location") String location, @Param("office") String office);
}
