package com.coffee.coffeeApp.dto;

import jakarta.validation.constraints.NotBlank;

public class SignupRequest {
    
    @NotBlank
    private String username;
    
    @NotBlank
    private String name;
    
    @NotBlank
    private String password;
    
    private String officeName;
    
    // Constructors
    public SignupRequest() {}
    
    public SignupRequest(String username, String name, String password, String officeName) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.officeName = officeName;
    }
    
    // Getters and Setters
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getOfficeName() {
        return officeName;
    }
    
    public void setOfficeName(String officeName) {
        this.officeName = officeName;
    }
}
