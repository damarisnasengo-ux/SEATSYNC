
// Import types from types.ts and constants from constants.ts to resolve compilation errors
import { Booking, BookingStatus, Venue, User, UserRole } from '../types';
import { INITIAL_VENUES, MOCK_USERS } from '../constants';

// Simulated DB State
let dbBookings: any[] = [
  { 
    id: 'b1', 
    userId: 'u1', 
    venueId: 'v1', 
    purpose: 'Advanced Algorithms', 
    date: new Date().toISOString().split('T')[0], 
    startTime: '09:00', 
    endTime: '11:00', 
    status: BookingStatus.CONFIRMED 
  },
  { 
    id: 'b2', 
    userId: 'u2', 
    venueId: 'v2', 
    purpose: 'Data Science Project', 
    date: new Date().toISOString().split('T')[0], 
    startTime: '14:00', 
    endTime: '16:00', 
    status: BookingStatus.PENDING 
  }
];

export const mockApi = {
  fetchVenues: async (): Promise<any[]> => {
    return new Promise(resolve => setTimeout(() => resolve(INITIAL_VENUES), 600));
  },

  fetchBookings: async (): Promise<any[]> => {
    return new Promise(resolve => setTimeout(() => resolve(dbBookings), 800));
  },

  checkConflict: (venueId: string, date: string, start: string, end: string): boolean => {
    const requestedStart = new Date(`${date}T${start}`);
    const requestedEnd = new Date(`${date}T${end}`);

    return dbBookings.some(booking => {
      // Conflicts only matter against CONFIRMED bookings for booking logic, 
      // but we check PENDING too to prevent multiple overlaps waiting for approval.
      if (booking.venueId !== venueId || booking.date !== date || booking.status === BookingStatus.CANCELLED) return false;
      const bStart = new Date(`${date}T${booking.startTime}`);
      const bEnd = new Date(`${date}T${booking.endTime}`);
      return (requestedStart < bEnd && requestedEnd > bStart);
    });
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'status'>, role: UserRole): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (role === UserRole.STUDENT) throw new Error('Students are not authorized to book venues.');
    
    const conflict = mockApi.checkConflict(booking.venueId, booking.date, booking.startTime, booking.endTime);
    if (conflict) throw new Error('Venue is already booked for this time slot.');

    const newBooking: Booking = {
      ...booking,
      id: `b${Date.now()}`,
      // Only Admin bookings are CONFIRMED immediately.
      status: role === UserRole.ADMIN ? BookingStatus.CONFIRMED : BookingStatus.PENDING,
    };
    dbBookings.push(newBooking);
    return newBooking;
  },

  updateBookingStatus: async (id: string, status: BookingStatus): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    dbBookings = dbBookings.map(b => b.id === id ? { ...b, status } : b);
  }
};
