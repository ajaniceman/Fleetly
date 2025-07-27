-- Fleetly Fleet Management System - MySQL Database Schema
-- This script creates all necessary tables with proper relationships and indexes

-- Create database
CREATE DATABASE IF NOT EXISTS fleetly_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fleetly_db;

-- Roles table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role_id INT NOT NULL,
    avatar_url VARCHAR(500),
    language_preference VARCHAR(5) DEFAULT 'en',
    theme_preference ENUM('light', 'dark') DEFAULT 'light',
    currency_preference VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    maintenance_alerts BOOLEAN DEFAULT TRUE,
    fuel_alerts BOOLEAN DEFAULT FALSE,
    incident_alerts BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_email (email),
    INDEX idx_role (role_id),
    INDEX idx_active (is_active)
);

-- Service providers table
CREATE TABLE service_providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('maintenance', 'fuel', 'insurance', 'other') NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    website VARCHAR(500),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_type (type),
    INDEX idx_active (is_active)
);

-- Vehicles table
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    vin VARCHAR(17) UNIQUE,
    status ENUM('active', 'maintenance', 'out_of_service') DEFAULT 'active',
    current_driver_id INT NULL,
    mileage INT DEFAULT 0,
    fuel_type ENUM('gasoline', 'diesel', 'electric', 'hybrid') NOT NULL,
    purchase_date DATE,
    purchase_cost DECIMAL(12,2),
    purchase_currency VARCHAR(3) DEFAULT 'USD',
    registration_expiry DATE,
    insurance_expiry DATE,
    last_inspection DATE,
    next_inspection_due DATE,
    next_service_due DATE,
    next_service_mileage INT,
    image_url VARCHAR(500),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_license_plate (license_plate),
    INDEX idx_status (status),
    INDEX idx_current_driver (current_driver_id),
    INDEX idx_active (is_active),
    INDEX idx_registration_expiry (registration_expiry),
    INDEX idx_insurance_expiry (insurance_expiry),
    INDEX idx_next_service_due (next_service_due)
);

-- Drivers table
CREATE TABLE drivers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    license_number VARCHAR(50) NOT NULL UNIQUE,
    license_issue_date DATE,
    license_expiry DATE NOT NULL,
    medical_certificate_expiry DATE,
    date_of_birth DATE,
    status ENUM('active', 'on_leave', 'suspended') DEFAULT 'active',
    assigned_vehicle_id INT NULL,
    hire_date DATE NOT NULL,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    avatar_url VARCHAR(500),
    address TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    INDEX idx_employee_id (employee_id),
    INDEX idx_license_number (license_number),
    INDEX idx_status (status),
    INDEX idx_assigned_vehicle (assigned_vehicle_id),
    INDEX idx_license_expiry (license_expiry),
    INDEX idx_medical_expiry (medical_certificate_expiry),
    INDEX idx_active (is_active)
);

-- Update vehicles table to reference drivers
ALTER TABLE vehicles ADD FOREIGN KEY (current_driver_id) REFERENCES drivers(id) ON DELETE SET NULL;

-- Maintenance records table
CREATE TABLE maintenance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    due_date DATE NOT NULL,
    completion_date DATE NULL,
    status ENUM('scheduled', 'in_progress', 'completed', 'overdue', 'cancelled') DEFAULT 'scheduled',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    assigned_mechanic VARCHAR(255),
    service_provider_id INT NULL,
    estimated_cost DECIMAL(10,2),
    estimated_currency VARCHAR(3) DEFAULT 'USD',
    actual_cost DECIMAL(10,2) NULL,
    actual_currency VARCHAR(3) NULL,
    mileage_at_service INT,
    next_service_mileage INT,
    parts_used TEXT,
    labor_hours DECIMAL(5,2),
    warranty_expiry DATE,
    notes TEXT,
    attachments JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (service_provider_id) REFERENCES service_providers(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_priority (priority),
    INDEX idx_active (is_active)
);

-- Fuel logs table
CREATE TABLE fuel_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    driver_id INT NOT NULL,
    date DATE NOT NULL,
    odometer_reading INT NOT NULL,
    fuel_type ENUM('gasoline', 'diesel', 'electric', 'hybrid') NOT NULL,
    quantity DECIMAL(8,2) NOT NULL,
    unit_cost DECIMAL(8,4) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    location VARCHAR(255),
    fuel_station VARCHAR(255),
    receipt_number VARCHAR(100),
    payment_method ENUM('cash', 'card', 'fuel_card', 'account') DEFAULT 'card',
    efficiency_calculated DECIMAL(6,2), -- L/100km or MPG
    notes TEXT,
    receipt_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_driver (driver_id),
    INDEX idx_date (date),
    INDEX idx_active (is_active)
);

-- Incidents table
CREATE TABLE incidents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    time TIME,
    vehicle_id INT NOT NULL,
    driver_id INT NOT NULL,
    type ENUM('accident', 'breakdown', 'violation', 'theft', 'other') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    status ENUM('reported', 'investigating', 'resolved', 'closed') DEFAULT 'reported',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    weather_conditions VARCHAR(100),
    road_conditions VARCHAR(100),
    police_report_number VARCHAR(100),
    insurance_claim_number VARCHAR(100),
    reported_by INT NOT NULL,
    assigned_to INT NULL,
    estimated_cost DECIMAL(12,2),
    estimated_currency VARCHAR(3) DEFAULT 'USD',
    actual_cost DECIMAL(12,2) NULL,
    actual_currency VARCHAR(3) NULL,
    third_party_involved BOOLEAN DEFAULT FALSE,
    third_party_details TEXT,
    witness_details TEXT,
    photos JSON,
    documents JSON,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE NULL,
    resolution_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE RESTRICT,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_incident_id (incident_id),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_driver (driver_id),
    INDEX idx_date (date),
    INDEX idx_type (type),
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_active (is_active)
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('maintenance_reminder', 'license_expiry', 'document_expiry', 'incident_alert', 'system_alert', 'welcome') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_type (type),
    INDEX idx_read (is_read),
    INDEX idx_priority (priority),
    INDEX idx_expires (expires_at)
);

-- Email templates table
CREATE TABLE email_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT NOT NULL,
    variables JSON,
    type ENUM('maintenance_reminder', 'license_expiry', 'document_expiry', 'incident_alert', 'welcome', 'password_reset') NOT NULL,
    language VARCHAR(5) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_language (language),
    INDEX idx_active (is_active)
);

-- Currency exchange rates table
CREATE TABLE currency_rates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    base_currency VARCHAR(3) NOT NULL,
    target_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(15,8) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_rate (base_currency, target_currency, date),
    INDEX idx_currencies (base_currency, target_currency),
    INDEX idx_date (date)
);

-- System settings table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_key (setting_key),
    INDEX idx_public (is_public)
);

-- Audit log table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_created (created_at)
);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('Super Admin', 'Full system access', JSON_ARRAY('*')),
('Fleet Manager', 'Manage fleet operations', JSON_ARRAY('vehicles.*', 'drivers.*', 'maintenance.*', 'fuel.*', 'incidents.*', 'reports.view')),
('Maintenance Manager', 'Manage maintenance operations', JSON_ARRAY('vehicles.view', 'maintenance.*', 'reports.view')),
('Driver', 'Limited access for drivers', JSON_ARRAY('vehicles.view', 'fuel.create', 'incidents.create', 'profile.*')),
('Viewer', 'Read-only access', JSON_ARRAY('*.view', 'reports.view'));

-- Insert default admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (email, password_hash, name, role_id) VALUES
('admin@fleetly.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'System Administrator', 1);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, data_type, description, is_public) VALUES
('company_name', 'Fleetly Fleet Management', 'string', 'Company name displayed in the application', TRUE),
('default_currency', 'USD', 'string', 'Default currency for the system', TRUE),
('supported_currencies', '["USD", "EUR", "GBP", "CAD", "BAM"]', 'json', 'List of supported currencies', TRUE),
('supported_languages', '["en", "es", "fr", "de", "bs"]', 'json', 'List of supported languages', TRUE),
('maintenance_reminder_days', '[30, 15, 7, 3]', 'json', 'Days before maintenance due to send reminders', FALSE),
('license_expiry_reminder_days', '[90, 30, 15, 7]', 'json', 'Days before license expiry to send reminders', FALSE),
('document_expiry_reminder_days', '[60, 30, 15, 7]', 'json', 'Days before document expiry to send reminders', FALSE),
('email_from_address', 'noreply@fleetly.com', 'string', 'Default from email address', FALSE),
('email_from_name', 'Fleetly System', 'string', 'Default from name for emails', FALSE);

-- Insert sample email templates
INSERT INTO email_templates (name, subject, html_content, text_content, variables, type, language) VALUES
('maintenance_reminder_en', 'Maintenance Reminder: {{vehicle_plate}} - {{service_type}}', 
'<h2>Maintenance Reminder</h2><p>Vehicle <strong>{{vehicle_plate}}</strong> requires <strong>{{service_type}}</strong> maintenance.</p><p>Due Date: {{due_date}}</p><p>Days Until Due: {{days_until_due}}</p>',
'Maintenance Reminder\n\nVehicle {{vehicle_plate}} requires {{service_type}} maintenance.\nDue Date: {{due_date}}\nDays Until Due: {{days_until_due}}',
JSON_ARRAY('vehicle_plate', 'service_type', 'due_date', 'days_until_due'), 'maintenance_reminder', 'en'),

('license_expiry_en', 'License Expiry Alert: {{driver_name}}',
'<h2>License Expiry Alert</h2><p>Driver <strong>{{driver_name}}</strong> license expires on <strong>{{expiry_date}}</strong>.</p><p>Days Until Expiry: {{days_until_expiry}}</p>',
'License Expiry Alert\n\nDriver {{driver_name}} license expires on {{expiry_date}}.\nDays Until Expiry: {{days_until_expiry}}',
JSON_ARRAY('driver_name', 'expiry_date', 'days_until_expiry'), 'license_expiry', 'en');

-- Create indexes for performance
CREATE INDEX idx_vehicles_service_due ON vehicles(next_service_due) WHERE next_service_due IS NOT NULL;
CREATE INDEX idx_drivers_license_expiry ON drivers(license_expiry) WHERE license_expiry IS NOT NULL;
CREATE INDEX idx_maintenance_due ON maintenance_records(due_date, status);
CREATE INDEX idx_fuel_efficiency ON fuel_logs(vehicle_id, date, efficiency_calculated);
CREATE INDEX idx_incidents_severity ON incidents(severity, status, date);
