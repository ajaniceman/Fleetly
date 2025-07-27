export interface Vehicle {
  id: string
  licensePlate: string
  make: string
  model: string
  year: number
  vin: string
  status: "active" | "maintenance" | "out-of-service"
  currentDriver?: string
  nextServiceDue: string
  mileage: number
  fuelType: string
  purchaseDate: string
  purchaseCost: number
  image?: string
}

export interface Driver {
  id: string
  name: string
  employeeId: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiry: string
  status: "active" | "on-leave" | "suspended"
  assignedVehicle?: string
  hireDate: string
  emergencyContact: {
    name: string
    phone: string
  }
  avatar?: string
}

export interface MaintenanceTask {
  id: string
  vehicleId: string
  vehicleLicensePlate: string
  serviceType: string
  description: string
  scheduledDate: string
  dueDate: string
  status: "scheduled" | "in-progress" | "completed" | "overdue"
  assignedMechanic?: string
  estimatedCost: number
  actualCost?: number
  notes?: string
}

export interface FuelEntry {
  id: string
  vehicleId: string
  vehicleLicensePlate: string
  driverId: string
  driverName: string
  date: string
  odometerReading: number
  fuelType: string
  quantity: number
  unitCost: number
  totalCost: number
  location: string
  notes?: string
}

export interface Incident {
  id: string
  incidentId: string
  date: string
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
}

// Mock data
export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    licensePlate: "ABC-123",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    vin: "1HGBH41JXMN109186",
    status: "active",
    currentDriver: "1",
    nextServiceDue: "2024-02-15",
    mileage: 45000,
    fuelType: "Gasoline",
    purchaseDate: "2022-01-15",
    purchaseCost: 28000,
  },
  {
    id: "2",
    licensePlate: "XYZ-789",
    make: "Ford",
    model: "Transit",
    year: 2021,
    vin: "2FMDK3GC4DBA12345",
    status: "maintenance",
    nextServiceDue: "2024-01-20",
    mileage: 62000,
    fuelType: "Diesel",
    purchaseDate: "2021-03-10",
    purchaseCost: 35000,
  },
  {
    id: "3",
    licensePlate: "DEF-456",
    make: "Chevrolet",
    model: "Silverado",
    year: 2023,
    vin: "1GCUYDED5NZ123456",
    status: "active",
    currentDriver: "2",
    nextServiceDue: "2024-03-01",
    mileage: 28000,
    fuelType: "Gasoline",
    purchaseDate: "2023-01-05",
    purchaseCost: 42000,
  },
]

export const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "John Smith",
    employeeId: "EMP001",
    email: "john.smith@company.com",
    phone: "+1-555-0123",
    licenseNumber: "DL123456789",
    licenseExpiry: "2025-06-15",
    status: "active",
    assignedVehicle: "1",
    hireDate: "2020-03-15",
    emergencyContact: {
      name: "Jane Smith",
      phone: "+1-555-0124",
    },
  },
  {
    id: "2",
    name: "Sarah Johnson",
    employeeId: "EMP002",
    email: "sarah.johnson@company.com",
    phone: "+1-555-0125",
    licenseNumber: "DL987654321",
    licenseExpiry: "2024-12-20",
    status: "active",
    assignedVehicle: "3",
    hireDate: "2021-07-10",
    emergencyContact: {
      name: "Mike Johnson",
      phone: "+1-555-0126",
    },
  },
  {
    id: "3",
    name: "Robert Davis",
    employeeId: "EMP003",
    email: "robert.davis@company.com",
    phone: "+1-555-0127",
    licenseNumber: "DL456789123",
    licenseExpiry: "2024-08-30",
    status: "on-leave",
    hireDate: "2019-11-20",
    emergencyContact: {
      name: "Lisa Davis",
      phone: "+1-555-0128",
    },
  },
]

export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicleLicensePlate: "ABC-123",
    serviceType: "Oil Change",
    description: "Regular oil change and filter replacement",
    scheduledDate: "2024-01-15",
    dueDate: "2024-01-15",
    status: "scheduled",
    assignedMechanic: "Mike Wilson",
    estimatedCost: 150,
  },
  {
    id: "2",
    vehicleId: "2",
    vehicleLicensePlate: "XYZ-789",
    serviceType: "Brake Inspection",
    description: "Complete brake system inspection and pad replacement",
    scheduledDate: "2024-01-18",
    dueDate: "2024-01-20",
    status: "in-progress",
    assignedMechanic: "Tom Anderson",
    estimatedCost: 450,
    actualCost: 420,
  },
  {
    id: "3",
    vehicleId: "3",
    vehicleLicensePlate: "DEF-456",
    serviceType: "Tire Rotation",
    description: "Rotate tires and check alignment",
    scheduledDate: "2024-01-25",
    dueDate: "2024-01-25",
    status: "scheduled",
    assignedMechanic: "Steve Brown",
    estimatedCost: 100,
  },
]

export const mockFuelEntries: FuelEntry[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicleLicensePlate: "ABC-123",
    driverId: "1",
    driverName: "John Smith",
    date: "2024-01-10",
    odometerReading: 44850,
    fuelType: "Gasoline",
    quantity: 45.5,
    unitCost: 1.45,
    totalCost: 65.98,
    location: "Shell Station - Main St",
  },
  {
    id: "2",
    vehicleId: "3",
    vehicleLicensePlate: "DEF-456",
    driverId: "2",
    driverName: "Sarah Johnson",
    date: "2024-01-12",
    odometerReading: 27850,
    fuelType: "Gasoline",
    quantity: 52.3,
    unitCost: 1.42,
    totalCost: 74.27,
    location: "BP Station - Highway 101",
  },
]

export const mockIncidents: Incident[] = [
  {
    id: "1",
    incidentId: "INC-2024-001",
    date: "2024-01-08",
    vehicleId: "1",
    vehicleLicensePlate: "ABC-123",
    driverId: "1",
    driverName: "John Smith",
    type: "accident",
    severity: "medium",
    status: "investigating",
    description: "Minor fender bender in parking lot",
    location: "123 Business Park Dr",
    reportedBy: "John Smith",
    estimatedCost: 1200,
  },
  {
    id: "2",
    incidentId: "INC-2024-002",
    date: "2024-01-05",
    vehicleId: "2",
    vehicleLicensePlate: "XYZ-789",
    driverId: "3",
    driverName: "Robert Davis",
    type: "breakdown",
    severity: "high",
    status: "resolved",
    description: "Engine overheating on highway",
    location: "Highway 95, Mile Marker 45",
    reportedBy: "Robert Davis",
    estimatedCost: 800,
    actualCost: 750,
  },
]
