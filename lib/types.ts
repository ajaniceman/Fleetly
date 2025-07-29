export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
  vin: string
  status: "active" | "inactive" | "maintenance"
  mileage: number
  fuelType: string
  location: string
  assignedDriverId?: string
  lastMaintenance?: string
  nextMaintenance?: string
  insuranceExpiry: string
  registrationExpiry: string
  createdAt: string
  updatedAt: string
}

export interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiry: string
  status: "active" | "inactive" | "suspended"
  hireDate: string
  address: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: string
  updatedAt: string
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  type: "scheduled" | "repair" | "inspection"
  description: string
  cost: number
  date: string
  mileage?: number
  serviceProvider: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  nextServiceDate?: string
  createdAt: string
  updatedAt: string
}

export interface FuelRecord {
  id: string
  vehicleId: string
  driverId: string
  date: string
  amount: number
  cost: number
  pricePerUnit: number
  mileage?: number
  location: string
  receiptNumber?: string
  createdAt: string
  updatedAt: string
}

export interface Incident {
  id: string
  vehicleId: string
  driverId: string
  type: "accident" | "breakdown" | "violation" | "other"
  severity: "minor" | "major" | "critical"
  description: string
  date: string
  location: string
  status: "reported" | "investigating" | "resolved" | "pending"
  cost?: number
  insuranceClaim?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "manager" | "driver"
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: "maintenance" | "license_expiry" | "incident" | "fuel" | "general"
  title: string
  message: string
  read: boolean
  createdAt: string
}
