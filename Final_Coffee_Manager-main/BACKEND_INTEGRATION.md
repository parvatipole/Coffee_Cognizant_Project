# Backend Integration Guide - Spring Boot + MySQL

This document outlines how to integrate a **Spring Boot backend with MySQL** to the Coffee Manager frontend.

## Current Status

✅ **Frontend**: Fully functional with development server  
✅ **Frontend API Client**: Ready for Spring Boot integration  
⏳ **Backend**: Ready for Spring Boot + MySQL implementation

## Technology Stack

- **Backend**: Spring Boot 3.x + Spring Data JPA
- **Database**: MySQL 8.x
- **Authentication**: JWT with Spring Security
- **API**: RESTful endpoints with JSON responses

## Quick Setup

### Prerequisites
```bash
# Required tools
- Java 17 or later
- Maven 3.6+
- MySQL 8.x server
- MySQL Workbench (optional)
```

### Spring Boot Project Structure
```
coffee-manager-backend/
├── src/main/java/com/coffemanager/
│   ├── CoffeeManagerApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   └── JwtConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   └── MachineController.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Machine.java
│   │   ├── Alert.java
│   │   └── Refill.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   └── MachineRepository.java
│   ├── service/
│   │   ├── AuthService.java
│   │   └── MachineService.java
│   └── dto/
│       ├── LoginRequest.java
│       ├── LoginResponse.java
│       └── MachineDto.java
├── src/main/resources/
│   ├── application.yml
│   └── data.sql
└── pom.xml
```

## Required Dependencies (pom.xml)

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

## Database Configuration

### application.yml
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/coffee_manager
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true

server:
  port: 8080

jwt:
  secret: ${JWT_SECRET:mySecretKey}
  expiration: 86400000  # 24 hours

cors:
  allowed-origins: 
    - http://localhost:5173
    - http://localhost:3000
```

### MySQL Database Setup
```sql
-- Create database
CREATE DATABASE coffee_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'coffee_user'@'localhost' IDENTIFIED BY 'coffee_password';
GRANT ALL PRIVILEGES ON coffee_manager.* TO 'coffee_user'@'localhost';
FLUSH PRIVILEGES;
```

## Required API Endpoints

### Authentication Controller
```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    @PostMapping("/signin")
    public ResponseEntity<LoginResponse> signin(@RequestBody LoginRequest request) {
        // Implementation here
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody SignupRequest request) {
        // Implementation here
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/signout")
    public ResponseEntity<Map<String, String>> signout(HttpServletRequest request) {
        // Implementation here
        return ResponseEntity.ok(Map.of("message", "Signed out successfully"));
    }
}
```

### Machine Controller
```java
@RestController
@RequestMapping("/api/machines")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MachineController {

    @GetMapping
    public ResponseEntity<List<MachineDto>> getAllMachines() {
        // Implementation here
        return ResponseEntity.ok(machines);
    }

    @GetMapping("/machine/{machineId}")
    public ResponseEntity<MachineDto> getMachineByMachineId(@PathVariable String machineId) {
        // Implementation here
        return ResponseEntity.ok(machine);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MachineDto> updateMachine(@PathVariable Long id, @RequestBody MachineDto machineDto) {
        // Implementation here
        return ResponseEntity.ok(updatedMachine);
    }

    @PutMapping("/{id}/supplies")
    public ResponseEntity<Map<String, String>> updateSupplies(@PathVariable Long id, @RequestBody SupplyUpdateRequest request) {
        // Implementation here
        return ResponseEntity.ok(Map.of("message", "Supplies updated successfully"));
    }

    @GetMapping("/locations")
    public ResponseEntity<List<String>> getLocations() {
        // Implementation here
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/offices")
    public ResponseEntity<List<String>> getOffices(@RequestParam String location) {
        // Implementation here
        return ResponseEntity.ok(offices);
    }

    @GetMapping("/floors")
    public ResponseEntity<List<String>> getFloors(@RequestParam String location, @RequestParam String office) {
        // Implementation here
        return ResponseEntity.ok(floors);
    }

    @GetMapping("/by-location-office-floor")
    public ResponseEntity<List<MachineDto>> getMachinesByLocationOfficeFloor(
            @RequestParam String location,
            @RequestParam String office,
            @RequestParam String floor) {
        // Implementation here
        return ResponseEntity.ok(machines);
    }

    @GetMapping("/low-supplies")
    public ResponseEntity<List<MachineDto>> getLowSupplyMachines(@RequestParam(defaultValue = "30") int threshold) {
        // Implementation here
        return ResponseEntity.ok(lowSupplyMachines);
    }

    @GetMapping("/maintenance-needed")
    public ResponseEntity<List<MachineDto>> getMaintenanceNeededMachines() {
        // Implementation here
        return ResponseEntity.ok(maintenanceMachines);
    }
}
```

## JPA Entities

### Machine Entity
```java
@Entity
@Table(name = "machines")
public class Machine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String machineId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String office;

    private String floor;

    @Enumerated(EnumType.STRING)
    private MachineStatus status;

    @Enumerated(EnumType.STRING)
    private PowerStatus powerStatus;

    @Enumerated(EnumType.STRING)
    private ElectricityStatus electricityStatus;

    private LocalDateTime lastPowerUpdate;
    private LocalDate lastMaintenance;
    private LocalDate nextMaintenance;

    // Supply levels (0-100)
    private Integer waterLevel;
    private Integer milkLevel;
    private Integer coffeeLevel;  // Note: Frontend sends "coffeeBeans" but store as "coffee"
    private Integer sugarLevel;

    // Maintenance info
    @Enumerated(EnumType.STRING)
    private FilterStatus filterStatus;

    @Enumerated(EnumType.STRING)
    private CleaningStatus cleaningStatus;

    private Double pressure;

    // Usage stats
    private Integer dailyCups;
    private Integer weeklyCups;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "machine", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Alert> alerts = new ArrayList<>();

    @OneToMany(mappedBy = "machine", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Refill> recentRefills = new ArrayList<>();

    private LocalDateTime lastUpdated;
    private String updatedBy;

    // Constructors, getters, setters...
}
```

### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private String city;
    private String officeName;

    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    // Constructors, getters, setters...
}
```

### Alert Entity
```java
@Entity
@Table(name = "alerts")
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String alertId;  // For frontend compatibility

    @Enumerated(EnumType.STRING)
    private AlertType type;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private AlertCategory category;

    private Boolean resolved = false;
    private String resolvedBy;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id")
    private Machine machine;

    // Constructors, getters, setters...
}
```

## Enums

```java
public enum MachineStatus {
    operational, maintenance, offline
}

public enum PowerStatus {
    online, offline
}

public enum ElectricityStatus {
    available, unavailable
}

public enum FilterStatus {
    good, needs_replacement, critical
}

public enum CleaningStatus {
    clean, needs_cleaning, overdue
}

public enum UserRole {
    technician, admin
}

public enum AlertType {
    critical, warning, info
}

public enum AlertCategory {
    maintenance, supply, cleaning, system
}
```

## Frontend Integration

### CORS Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

### Frontend Environment Configuration
```bash
# .env file in frontend
VITE_API_BASE_URL=http://localhost:8080/api
VITE_STANDALONE_MODE=false
```

## Data Models (DTOs)

### Frontend expects these JSON structures:

#### Machine Response
```json
{
  "id": "string",
  "machineId": "string",
  "name": "string",
  "location": "string",
  "office": "string",
  "floor": "string",
  "status": "operational" | "maintenance" | "offline",
  "powerStatus": "online" | "offline",
  "electricityStatus": "available" | "unavailable",
  "lastPowerUpdate": "2024-01-16 09:30",
  "lastMaintenance": "2024-01-10",
  "nextMaintenance": "2024-02-10",
  "supplies": {
    "water": 85,
    "milk": 60,
    "coffee": 75,  // Important: Frontend sends "coffeeBeans" but expects "coffee" in response
    "sugar": 90
  },
  "maintenance": {
    "filterStatus": "good" | "needs_replacement" | "critical",
    "cleaningStatus": "clean" | "needs_cleaning" | "overdue",
    "pressure": 15
  },
  "usage": {
    "dailyCups": 127,
    "weeklyCups": 890
  },
  "notes": "string",
  "alerts": [],
  "recentRefills": []
}
```

#### Login Response
```json
{
  "accessToken": "string",
  "tokenType": "Bearer",
  "id": 1,
  "username": "string",
  "name": "string",
  "role": "technician" | "admin",
  "authorities": []
}
```

## Development Commands

```bash
# Start Spring Boot backend
mvn spring-boot:run

# Or with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Start frontend (in separate terminal)
cd frontend && npm run dev
```

## Important Notes

1. **Supply Key Mapping**: Frontend uses `"coffeeBeans"` but backend should store/return as `"coffee"`
2. **CORS**: Configure properly for localhost development
3. **JWT Security**: Implement proper JWT validation for protected endpoints
4. **Date Formats**: Use consistent date formatting (ISO strings recommended)
5. **Error Handling**: Return proper HTTP status codes and error messages

## Benefits of Spring Boot + MySQL

1. **Robust**: Production-ready framework with excellent ecosystem
2. **Scalable**: Handles high traffic and complex business logic
3. **Secure**: Built-in security features with Spring Security
4. **Reliable**: MySQL provides ACID compliance and data integrity
5. **Maintainable**: Clean architecture with separation of concerns

## Questions?

This Spring Boot setup provides a robust, scalable backend that integrates seamlessly with the Coffee Manager frontend. Implement the entities and controllers as shown, and the frontend will automatically detect and use your Spring Boot backend!
