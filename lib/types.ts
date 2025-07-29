export interface Vehicle {
  id: number
  license_plate: string
  make: string
  model: string
  year: number
  vin: string
  status: "active" | "maintenance" | "inactive"
  mileage: number
  fuel_type: "gasoline" | "diesel" | "electric" | "hybrid"
  driver_id?: number
  created_at: Date
  updated_at: Date
}

export interface Driver {
  id: number
  name: string
  email: string
  phone: string
  license_number: string
  license_expiry: Date
  status: "active" | "inactive" | "suspended"
  hire_date: Date
  created_at: Date
  updated_at: Date
}

export interface MaintenanceRecord {
  id: number
  vehicle_id: number
  service_type: string
  description: string
  scheduled_date: Date
  completed_date?: Date
  cost: number
  mileage: number
  status: "scheduled" | "in_progress" | "completed" | "overdue"
  created_at: Date
  updated_at: Date
}

export interface FuelRecord {
  id: number
  vehicle_id: number
  driver_id: number
  fuel_amount: number
  cost_per_unit: number
  total_cost: number
  odometer_reading: number
  fuel_station: string
  receipt_number: string
  date: Date
  created_at: Date
  updated_at: Date
}

export interface Incident {
  id: number
  incident_id: string
  vehicle_id: number
  driver_id: number
  type: "accident" | "breakdown" | "violation" | "theft"
  severity: "minor" | "medium" | "major" | "critical"
  description: string
  location: string
  date: Date
  status: "pending" | "investigating" | "resolved"
  cost: number
  created_at: Date
  updated_at: Date
}

export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "manager" | "driver"
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Notification {
  id: number
  user_id: number
  type: "maintenance_reminder" | "license_expiry" | "incident_alert" | "system"
  title: string
  message: string
  priority: "low" | "medium" | "high" | "critical"
  is_read: boolean
  action_url?: string
  related_entity_type?: string
  related_entity_id?: number
  expires_at?: Date
  email_sent?: boolean
  email_sent_at?: Date
  created_at: Date
  updated_at: Date
}

export interface CreateNotificationData {
  user_id: number
  type: Notification["type"]
  title: string
  message: string
  priority: Notification["priority"]
  action_url?: string
  related_entity_type?: string
  related_entity_id?: number
  expires_at?: string
  sendEmail?: boolean
}

export interface DashboardStats {
  totalVehicles: number
  activeVehicles: number
  totalDrivers: number
  activeDrivers: number
  pendingMaintenance: number
  totalIncidents: number
  monthlyFuelCost: number
  averageFuelEfficiency: number
}
