
export const COLORS = {
  primary: '#043C5C', // Dark Navy from Logo
  accent: '#E1D4B7',  // Cream/Gold from Logo
  secondary: '#0EA5E9', // Modern Academic Sky Blue
  background: '#FFFFD0', // Updated Light Mode Background from Logo
  darkBackground: '#021019', // Darker shade of Navy for Dark Mode
  text: '#1E293B',
  darkText: '#F1F5F9',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#64748B'
};

export const ROLE_COLORS = {
  STUDENT: '#2DD4BF',   // Turquoise
  CLASS_REP: '#FB923C', // Orange
  LECTURER: '#4ADE80',  // Green
  ADMIN: '#A78BFA'      // Violet
};

export const INITIAL_VENUES = [
  { id: 'v1', name: 'Lecture Hall A1', capacity: 120, location: 'Science Block', floor: 1, amenities: ['Projector', 'AC', 'PA System'] },
  { id: 'v2', name: 'Computer Lab 3', capacity: 45, location: 'IT Wing', floor: 3, amenities: ['PCs', 'High-Speed Internet', 'Whiteboard'] },
  { id: 'v3', name: 'Seminar Room 204', capacity: 30, location: 'Arts Complex', floor: 2, amenities: ['Modular Seating', 'Smart Board'] },
  { id: 'v4', name: 'Main Auditorium', capacity: 500, location: 'Central Admin', floor: 1, amenities: ['Stage', 'Sound System', 'Lighting Rig'] },
];

export const MOCK_USERS = [
  { id: 'u1', name: 'Dr. James Mwangi', email: 'james@campus.edu', role: 'LECTURER', avatar: 'https://picsum.photos/seed/dr/200' },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@student.edu', role: 'CLASS_REP', avatar: 'https://picsum.photos/seed/sarah/200' },
  { id: 'u3', name: 'Admin Root', email: 'admin@campus.edu', role: 'ADMIN', avatar: 'https://picsum.photos/seed/admin/200' },
  { id: 'u4', name: 'Mark Otieno', email: 'mark@student.edu', role: 'STUDENT', avatar: 'https://picsum.photos/seed/mark/200' },
];

export const TRANSITIONS = {
  standard: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  fast: 'transition-all duration-150 ease-in-out',
};
