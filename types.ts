
export enum UserRole {
  LECTURER = 'LECTURER',
  CLASS_REP = 'CLASS_REP',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  code: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId: string;
  avatar?: string;
}

export interface Venue {
  id: string;
  institutionId: string;
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
  institutionId: string;
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
  institution: Institution | null;
  venues: Venue[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}
