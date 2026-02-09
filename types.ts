export enum UserRole {
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export enum TaskType {
  GARBAGE_COLLECTION = 'Garbage Collection',
  BROOMING = 'Brooming',
  MOPPING = 'Mopping',
  DRIVEWAY = 'Driveway Cleaning',
  GLASS_CLEANING = 'Glass Cleaning',
  STAIRCASE = 'Staircase Cleaning'
}

export enum Frequency {
  DAILY = 'Daily',
  WEEKLY = 'Weekly'
}

export interface TaskDefinition {
  id: string;
  title: string;
  type: TaskType;
  frequency: Frequency;
  area: string; // e.g., "Block 1 Lobby", "Driveway"
  block?: number;
}

export interface TaskLog {
  id: string;
  taskId: string;
  staffId: number;
  timestamp: number;
  status: 'COMPLETED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  imageUrl?: string;
  aiFeedback?: string;
  aiRating?: number; // 1-10
}

export interface SupplyRequest {
  id: string;
  item: string;
  quantity: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'FULFILLED';
  requesterId: number;
  timestamp: number;
}

export interface StaffMember {
  id: number;
  name: string;
  role: 'Housekeeper';
}

export const STAFF_MEMBERS: StaffMember[] = [
  { id: 1, name: "Rajesh Kumar", role: "Housekeeper" },
  { id: 2, name: "Sunita Devi", role: "Housekeeper" },
  { id: 3, name: "Amit Singh", role: "Housekeeper" },
];

export const BLOCKS = [1, 2, 3, 4, 5, 6];
