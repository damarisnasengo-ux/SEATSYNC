
import { Booking, BookingStatus, Venue, User, UserRole } from '../types';
import { INITIAL_VENUES, MOCK_USERS } from '../constants';

// Simulated DB State
let dbBookings: any[] = [
  { 
    id: 'b1', 
    userId: 'u1', 
    venueId: 'v1', 
    institutionId: 'inst-1',
    purpose: 'Academic Senate Meeting', 
    date: new Date().toISOString().split('T')[0], 
    startTime: '09:00', 
    endTime: '11:00', 
    status: BookingStatus.CONFIRMED 
  },
  { 
    id: 'b2', 
    userId: 'u2', 
    venueId: 'v2', 
    institutionId: 'inst-1',
    purpose: 'Computer Science Practical', 
    date: new Date().toISOString().split('T')[0], 
    startTime: '14:00', 
    endTime: '16:00', 
    status: BookingStatus.PENDING 
  },
  { 
    id: 'b3', 
    userId: 'u4', 
    venueId: 'v4', 
    institutionId: 'inst-2',
    purpose: 'Agriculture Symposium', 
    date: new Date().toISOString().split('T')[0], 
    startTime: '10:00', 
    endTime: '12:00', 
    status: BookingStatus.CONFIRMED 
  }
];

export const mockApi = {
  fetchVenues: async (institutionId: string): Promise<Venue[]> => {
    return new Promise(resolve => setTimeout(() => {
      resolve(INITIAL_VENUES.filter(v => v.institutionId === institutionId));
    }, 600));
  },

  fetchBookings: async (institutionId: string): Promise<Booking[]> => {
    return new Promise(resolve => setTimeout(() => {
      resolve(dbBookings.filter(b => b.institutionId === institutionId));
    }, 800));
  },

  checkConflict: (venueId: string, date: string, start: string, end: string): boolean => {
    const requestedStart = new Date(`${date}T${start}`);
    const requestedEnd = new Date(`${date}T${end}`);

    return dbBookings.some(booking => {
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
