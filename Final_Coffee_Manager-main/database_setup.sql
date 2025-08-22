-- =====================================================
-- CoffeeFlow MySQL Database Setup
-- This file creates the complete database structure needed for the Spring Boot backend
-- =====================================================

-- Step 1: Create Database and User
-- Run this as MySQL root user

-- Create the database
DROP DATABASE IF EXISTS coffee_flow_db;
CREATE DATABASE coffee_flow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user for the application (recommended for security)
DROP USER IF EXISTS 'coffeeflow'@'localhost';
CREATE USER 'coffeeflow'@'localhost' IDENTIFIED BY 'coffee123';
GRANT ALL PRIVILEGES ON coffee_flow_db.* TO 'coffeeflow'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE coffee_flow_db;

-- =====================================================
-- Step 2: Create Tables
-- These tables will also be auto-created by Spring Boot JPA, but this ensures they exist
-- =====================================================

-- Users table for JWT authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(120) NOT NULL, -- BCrypt encoded passwords
    role ENUM('TECHNICIAN', 'ADMIN') NOT NULL,
    office_name VARCHAR(100) NULL, -- Office for technicians, NULL for admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_office (office_name)
);

-- Coffee machines table
CREATE TABLE IF NOT EXISTS coffee_machine (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    machine_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    office VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    status ENUM('OPERATIONAL', 'MAINTENANCE', 'OFFLINE') NOT NULL DEFAULT 'OPERATIONAL',
    
    -- Supply levels (0-100 percentage)
    water_level INT DEFAULT 100 CHECK (water_level >= 0 AND water_level <= 100),
    milk_level INT DEFAULT 100 CHECK (milk_level >= 0 AND milk_level <= 100),
    coffee_beans_level INT DEFAULT 100 CHECK (coffee_beans_level >= 0 AND coffee_beans_level <= 100),
    sugar_level INT DEFAULT 100 CHECK (sugar_level >= 0 AND sugar_level <= 100),
    
    -- Maintenance status
    filter_status ENUM('GOOD', 'NEEDS_REPLACEMENT', 'CRITICAL') DEFAULT 'GOOD',
    cleaning_status ENUM('CLEAN', 'NEEDS_CLEANING', 'OVERDUE') DEFAULT 'CLEAN',
    
    -- Performance metrics
    temperature DOUBLE DEFAULT 85.0,
    pressure DOUBLE DEFAULT 9.0,
    daily_cups INT DEFAULT 0,
    weekly_cups INT DEFAULT 0,
    monthly_revenue DECIMAL(10,2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_machine_id (machine_id),
    INDEX idx_location (location),
    INDEX idx_office (office),
    INDEX idx_status (status),
    INDEX idx_location_office (location, office),
    INDEX idx_supply_levels (water_level, milk_level, coffee_beans_level, sugar_level)
);

-- =====================================================
-- Step 3: Insert Sample Data
-- =====================================================

-- Insert default admin user
-- Password is "password" encoded with BCrypt
INSERT INTO users (username, name, password, role, office_name) VALUES 
('admin1', 'System Administrator', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ADMIN', NULL);

-- Insert sample technician users for testing
INSERT INTO users (username, name, password, role, office_name) VALUES 
('tech1', 'John Technician', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'TECHNICIAN', 'Downtown Office'),
('tech_main', 'Alice Smith', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'TECHNICIAN', 'Main Office'),
('tech_west', 'Bob Johnson', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'TECHNICIAN', 'West Branch');

-- Insert sample coffee machines
INSERT INTO coffee_machine (
    machine_id, name, location, office, floor, 
    water_level, milk_level, coffee_beans_level, sugar_level,
    filter_status, cleaning_status, temperature, pressure,
    daily_cups, weekly_cups, monthly_revenue
) VALUES 
-- Main Office machines
('CM-001', 'Coffee Maker Alpha', 'New York', 'Main Office', '2nd Floor', 85, 75, 90, 80, 'GOOD', 'CLEAN', 85.5, 9.2, 45, 280, 1250.50),
('CM-002', 'Coffee Maker Beta', 'New York', 'Main Office', '1st Floor', 60, 85, 70, 95, 'NEEDS_REPLACEMENT', 'CLEAN', 84.8, 8.9, 32, 210, 945.75),
('CM-003', 'Coffee Maker Gamma', 'New York', 'Main Office', '3rd Floor', 95, 60, 85, 75, 'GOOD', 'NEEDS_CLEANING', 86.1, 9.5, 38, 195, 875.25),

-- Downtown Office machines
('CM-101', 'Coffee Station One', 'New York', 'Downtown Office', 'Ground Floor', 40, 90, 55, 85, 'CRITICAL', 'CLEAN', 83.2, 8.5, 28, 156, 695.00),
('CM-102', 'Coffee Station Two', 'New York', 'Downtown Office', '1st Floor', 78, 45, 92, 68, 'GOOD', 'OVERDUE', 85.9, 9.1, 51, 298, 1340.25),

-- West Branch machines
('CM-201', 'Espresso Master', 'Los Angeles', 'West Branch', 'Ground Floor', 88, 72, 64, 91, 'NEEDS_REPLACEMENT', 'CLEAN', 87.3, 9.8, 67, 389, 1750.80),
('CM-202', 'Latte Maker Pro', 'Los Angeles', 'West Branch', '2nd Floor', 56, 83, 77, 42, 'GOOD', 'NEEDS_CLEANING', 84.6, 8.7, 29, 167, 745.50),

-- Chicago Office machines
('CM-301', 'Bean Brewer Deluxe', 'Chicago', 'North Office', '1st Floor', 92, 58, 81, 73, 'GOOD', 'CLEAN', 86.4, 9.3, 41, 234, 1045.75),
('CM-302', 'Cappuccino Creator', 'Chicago', 'North Office', '3rd Floor', 71, 94, 39, 86, 'CRITICAL', 'OVERDUE', 82.9, 8.2, 22, 128, 570.25);

-- =====================================================
-- Step 4: Verification Queries
-- =====================================================

-- Verify tables were created
SHOW TABLES;

-- Check users table
SELECT 'Users table:' as info;
SELECT id, username, name, role, office_name FROM users;

-- Check coffee machines table
SELECT 'Coffee machines table:' as info;
SELECT machine_id, name, location, office, floor, status FROM coffee_machine;

-- Check offices per location
SELECT 'Offices by location:' as info;
SELECT location, COUNT(DISTINCT office) as office_count, GROUP_CONCAT(DISTINCT office) as offices 
FROM coffee_machine 
GROUP BY location;

-- Check low supply machines
SELECT 'Machines with low supplies (<50%):' as info;
SELECT machine_id, name, office, water_level, milk_level, coffee_beans_level, sugar_level
FROM coffee_machine 
WHERE water_level < 50 OR milk_level < 50 OR coffee_beans_level < 50 OR sugar_level < 50;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

SELECT '========================================' as message;
SELECT 'CoffeeFlow Database Setup Complete!' as message;
SELECT '========================================' as message;
SELECT 'Database: coffee_flow_db' as config;
SELECT 'Username: coffeeflow' as config;
SELECT 'Password: coffee123' as config;
SELECT '========================================' as message;
SELECT 'Sample Users Created:' as message;
SELECT 'Admin: admin1 / password' as credentials;
SELECT 'Tech: tech1 / password (Downtown Office)' as credentials;
SELECT 'Tech: tech_main / password (Main Office)' as credentials;
SELECT 'Tech: tech_west / password (West Branch)' as credentials;
SELECT '========================================' as message;
