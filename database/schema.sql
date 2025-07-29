-- Fleetly Fleet Management System Database Schema

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'driver') DEFAULT 'driver',
    is_active BOOLEAN DEFAULT TRUE,
    language_preference VARCHAR(5) DEFAULT 'en',
    currency_preference VARCHAR(3) DEFAULT 'USD',
    email_notifications BOOLEAN DEFAULT TRUE,
    maintenance_alerts BOOLEAN DEFAULT TRUE,
    incident_alerts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    vin VARCHAR(17) UNIQUE,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    mileage INT DEFAULT 0,
    fuel_type ENUM('gasoline', 'diesel', 'electric', 'hybrid') DEFAULT 'gasoline',
    driver_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- Drivers table
CREATE TABLE drivers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Maintenance records table
CREATE TABLE maintenance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    due_date DATE,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    mileage INT,
    status ENUM('scheduled', 'in_progress', 'completed', 'overdue') DEFAULT 'scheduled',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Fuel records table
CREATE TABLE fuel_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    driver_id INT NOT NULL,
    fuel_amount DECIMAL(8, 2) NOT NULL,
    cost_per_unit DECIMAL(6, 3) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    odometer_reading INT,
    fuel_station VARCHAR(255),
    receipt_number VARCHAR(100),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Incidents table
CREATE TABLE incidents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id VARCHAR(50) UNIQUE NOT NULL,
    vehicle_id INT NOT NULL,
    driver_id INT NOT NULL,
    type ENUM('accident', 'breakdown', 'violation', 'theft') NOT NULL,
    severity ENUM('minor', 'medium', 'major', 'critical') DEFAULT 'medium',
    description TEXT NOT NULL,
    location VARCHAR(500),
    date DATE NOT NULL,
    status ENUM('pending', 'investigating', 'resolved') DEFAULT 'pending',
    cost DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('maintenance_reminder', 'license_expiry', 'incident_alert', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    expires_at TIMESTAMP NULL,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- System settings table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSON NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('maintenance_reminder_days', '[30, 15, 7, 3]', 'Days before maintenance due date to send reminders'),
('license_expiry_reminder_days', '[90, 30, 15, 7]', 'Days before license expiry to send reminders'),
('fuel_efficiency_threshold', '20.0', 'Minimum fuel efficiency (MPG) threshold for alerts'),
('incident_auto_notify', 'true', 'Automatically notify managers of new incidents'),
('backup_retention_days', '30', 'Number of days to retain database backups');

-- Create indexes for better performance
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_driver ON vehicles(driver_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_license_expiry ON drivers(license_expiry);
CREATE INDEX idx_maintenance_status ON maintenance_records(status);
CREATE INDEX idx_maintenance_due_date ON maintenance_records(due_date);
CREATE INDEX idx_fuel_date ON fuel_records(date);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_date ON incidents(date);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_expires ON notifications(expires_at);
