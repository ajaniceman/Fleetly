import type { Timestamp } from "firebase/firestore"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "driver"
  avatar?: string
  preferences: {
    theme: "light" | "dark"
    language: "en" | "es" | "fr" | "de"
    notifications: {
      email: boolean
      push: boolean
      maintenance: boolean
      fuel: boolean
      incidents: boolean
    }
  }
  lastLogin?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
}

export interface Vehicle {
  id: string
  licensePlate: string
  make: string
  model: string
  year: number
  vin: string
  status: "active" | "maintenance" | "out-of-service"
  currentDriver?: string
  nextServiceDue: Timestamp
  mileage: number
  fuelType: string
  purchaseDate: Timestamp
  purchaseCost: number
  registrationExpiry?: Timestamp
  insuranceExpiry?: Timestamp
  lastInspection?: Timestamp
  nextInspectionDue?: Timestamp
  image?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
}

export interface Driver {
  id: string
  name: string
  employeeId: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiry: Timestamp
  licenseIssueDate?: Timestamp
  medicalCertificateExpiry?: Timestamp
  dateOfBirth?: Timestamp
  status: "active" | "on-leave" | "suspended"
  assignedVehicle?: string
  hireDate: Timestamp
  emergencyContact: {
    name: string
    phone: string
  }
  avatar?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
}

export interface MaintenanceTask {
  id: string
  vehicleId: string
  vehicleLicensePlate: string
  serviceType: string
  description: string
  scheduledDate: Timestamp
  dueDate: Timestamp
  completionDate?: Timestamp
  status: "scheduled" | "in-progress" | "completed" | "overdue"
  priority: "low" | "medium" | "high" | "critical"
  assignedMechanic?: string
  estimatedCost: number
  actualCost?: number
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
}

export interface FuelEntry {
  id: string
  vehicleId: string
  vehicleLicensePlate: string
  driverId: string
  driverName: string
  date: Timestamp
  odometerReading: number
  fuelType: string
  quantity: number
  unitCost: number
  totalCost: number
  location: string
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
}

export interface Incident {
  id: string
  incidentId: string
  date: Timestamp
  vehicleId: string
  vehicleLicensePlate: string
  driverId: string
  driverName: string
  type: "accident" | "breakdown" | "violation" | "other"
  severity: "low" | "medium" | "high" | "critical"
  status: "reported" | "investigating" | "resolved" | "closed"
  description: string
  location: string
  reportedBy: string
  estimatedCost?: number
  actualCost?: number
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
}

export interface Notification {
  id: string
  userId: string
  type: "maintenance" | "license_expiry" | "document_expiry" | "incident" | "system"
  title: string
  message: string
  priority: "low" | "medium" | "high" | "critical"
  read: boolean
  actionUrl?: string
  relatedEntityId?: string
  relatedEntityType?: string
  createdAt: Timestamp
  expiresAt?: Timestamp
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  type: "maintenance_reminder" | "license_expiry" | "document_expiry" | "incident_alert" | "welcome"
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface NotificationSettings {
  maintenanceReminder: {
    enabled: boolean
    daysBefore: number[]
  }
  licenseExpiry: {
    enabled: boolean
    daysBefore: number[]
  }
  documentExpiry: {
    enabled: boolean
    daysBefore: number[]
  }
  incidentAlert: {
    enabled: boolean
    immediate: boolean
  }
}
