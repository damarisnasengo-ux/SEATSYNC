
export enum UserRole {
  LECTURER = 'LECTURER',
  CLASS_REP = 'CLASS_REP',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  floor: number;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  purpose: string;
  date: string; // ISO format YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  userName?: string;
  venueName?: string;
}

export interface AppState {
  user: User | null;
  venues: Venue[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}
