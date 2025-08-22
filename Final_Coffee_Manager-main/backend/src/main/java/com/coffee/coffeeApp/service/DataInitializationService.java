package com.coffee.coffeeApp.service;

import com.coffee.coffeeApp.entity.Machine;
import com.coffee.coffeeApp.entity.User;
import com.coffee.coffeeApp.repository.MachineRepository;
import com.coffee.coffeeApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private MachineRepository machineRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
        initializeMachines();
    }
    
    private void initializeUsers() {
        if (userRepository.count() == 0) {
            User admin = new User("admin", "Administrator", passwordEncoder.encode("admin123"), "Head Office");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            
            User user = new User("user", "John Doe", passwordEncoder.encode("user123"), "Branch Office");
            userRepository.save(user);
            
            System.out.println("Sample users created - admin:admin123, user:user123");
        }
    }
    
    private void initializeMachines() {
        if (machineRepository.count() == 0) {
            // Machine 1
            Machine machine1 = new Machine("CM001", "Coffee Maker Alpha", "New York", "Manhattan Office", "1st Floor");
            Map<String, Integer> supplies1 = new HashMap<>();
            supplies1.put("beans", 85);
            supplies1.put("water", 90);
            supplies1.put("milk", 70);
            supplies1.put("cups", 45);
            machine1.setSupplies(supplies1);
            machine1.setAlerts(Arrays.asList());
            machine1.setLastMaintenance(LocalDateTime.now().minusDays(15));
            
            // Machine 2
            Machine machine2 = new Machine("CM002", "Espresso Master", "New York", "Manhattan Office", "2nd Floor");
            machine2.setStatus("maintenance");
            Map<String, Integer> supplies2 = new HashMap<>();
            supplies2.put("beans", 25);
            supplies2.put("water", 60);
            supplies2.put("milk", 15);
            supplies2.put("cups", 80);
            machine2.setSupplies(supplies2);
            machine2.setAlerts(Arrays.asList("Low milk supply", "Scheduled maintenance"));
            machine2.setLastMaintenance(LocalDateTime.now().minusDays(30));
            
            // Machine 3
            Machine machine3 = new Machine("CM003", "Latte Express", "California", "San Francisco Office", "3rd Floor");
            Map<String, Integer> supplies3 = new HashMap<>();
            supplies3.put("beans", 95);
            supplies3.put("water", 85);
            supplies3.put("milk", 90);
            supplies3.put("cups", 75);
            machine3.setSupplies(supplies3);
            machine3.setAlerts(Arrays.asList());
            machine3.setLastMaintenance(LocalDateTime.now().minusDays(10));
            
            // Machine 4
            Machine machine4 = new Machine("CM004", "Cappuccino Pro", "California", "Los Angeles Office", "1st Floor");
            Map<String, Integer> supplies4 = new HashMap<>();
            supplies4.put("beans", 40);
            supplies4.put("water", 75);
            supplies4.put("milk", 30);
            supplies4.put("cups", 20);
            machine4.setSupplies(supplies4);
            machine4.setAlerts(Arrays.asList("Low cups supply"));
            machine4.setLastMaintenance(LocalDateTime.now().minusDays(20));
            
            machineRepository.saveAll(Arrays.asList(machine1, machine2, machine3, machine4));
            System.out.println("Sample machines initialized");
        }
    }
}
