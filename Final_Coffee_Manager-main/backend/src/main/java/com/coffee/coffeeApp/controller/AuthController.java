package com.coffee.coffeeApp.controller;

import com.coffee.coffeeApp.dto.LoginRequest;
import com.coffee.coffeeApp.dto.LoginResponse;
import com.coffee.coffeeApp.dto.SignupRequest;
import com.coffee.coffeeApp.entity.User;
import com.coffee.coffeeApp.repository.UserRepository;
import com.coffee.coffeeApp.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8080")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());
            
            if (userOptional.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid username or password");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            User user = userOptional.get();
            
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid username or password");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            String jwt = jwtUtil.generateJwtToken(user.getUsername());
            
            LoginResponse loginResponse = new LoginResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getRole(),
                user.getOfficeName()
            );
            
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Authentication failed");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Username is already taken!");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getName(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                signUpRequest.getOfficeName()
            );
            
            userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully!");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Registration failed");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User logged out successfully!");
        return ResponseEntity.ok(response);
    }
}
