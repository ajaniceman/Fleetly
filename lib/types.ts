export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
  vin: string
  status: "active" | "maintenance" | "inactive"
  mileage: number
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid"
  lastMaintenance: string
  nextMaintenance: string
  driver?: string
  location: string
}

export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiry: string
  status: "active" | "inactive" | "suspended"
  vehicleAssigned?: string
  hireDate: string
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  vehiclePlate: string
  type: "scheduled" | "repair" | "inspection"
  description: string
  date: string
  cost: number
  mileage: number
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  serviceProvider: string
  notes?: string
}

export interface FuelRecord {
  id: string
  vehicleId: string
  vehiclePlate: string
  date: string
  amount: number
  cost: number
  pricePerUnit: number
  mileage: number
  location: string
  driver: string
  receipt?: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "driver"
  createdAt: string
  lastLogin?: string
}

export interface Notification {
  id: string
  type: "maintenance" | "license_expiry" | "fuel_alert" | "incident"
  title: string
  message: string
  read: boolean
  createdAt: string
  userId: string
}
