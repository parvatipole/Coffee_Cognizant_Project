package com.coffee.coffeeApp.dto;

public class LoginResponse {
    
    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String username;
    private String name;
    private String role;
    private String officeName;
    
    // Constructors
    public LoginResponse() {}
    
    public LoginResponse(String accessToken, Long userId, String username, String name, String role, String officeName) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.role = role;
        this.officeName = officeName;
    }
    
    // Getters and Setters
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
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
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getOfficeName() {
        return officeName;
    }
    
    public void setOfficeName(String officeName) {
        this.officeName = officeName;
    }
}
