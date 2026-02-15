
import { Institution, UserRole, ChatMessage, Conversation } from './types';

export const COLORS = {
  primary: '#043C5C', 
  accent: '#E1D4B7',  
  secondary: '#0EA5E9', 
  background: '#FFFFD0', 
  darkBackground: '#021019', 
  text: '#1E293B',
  darkText: '#F1F5F9',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#64748B'
};

export const ROLE_COLORS = {
  STUDENT: '#2DD4BF',   
  CLASS_REP: '#FB923C', 
  LECTURER: '#4ADE80',  
  ADMIN: '#A78BFA'      
};

export const MOCK_INSTITUTIONS: Institution[] = [
  { id: 'inst-1', name: 'University of Nairobi', shortName: 'UoN', code: 'UON-MAIN', color: '#003399' },
  { id: 'inst-2', name: 'JKUAT', shortName: 'JKUAT', code: 'JKU-JUJA', color: '#006633' },
  { id: 'inst-3', name: 'Moi University', shortName: 'Moi', code: 'MOI-ELDR', color: '#B22222' },
  { id: 'inst-4', name: 'Egerton University', shortName: 'EU', code: 'EGER-NJORO', color: '#2E7D32' },
  { id: 'inst-5', name: 'University of Eldoret', shortName: 'UoE', code: 'UOE-MAIN', color: '#6A1B9A' }
];

export const INITIAL_VENUES = [
  // UoN Venues
  { id: 'v1', institutionId: 'inst-1', name: 'Taifa Hall', capacity: 500, location: 'Main Campus', floor: 1, amenities: ['Stage', 'Sound System', 'VIP Lounge'] },
  { id: 'v2', institutionId: 'inst-1', name: 'Gandhi Wing Lab', capacity: 60, location: 'Main Campus', floor: 2, amenities: ['PCs', 'High-Speed Internet'] },
  { id: 'v3', institutionId: 'inst-1', name: 'MPH Hall', capacity: 1200, location: 'Lower Kabete', floor: 1, amenities: ['Large Stage', 'PA System'] },
  
  // JKUAT Venues
  { id: 'v4', institutionId: 'inst-2', name: 'Assembly Hall', capacity: 400, location: 'Juja Main', floor: 1, amenities: ['Projector', 'AC'] },
  { id: 'v5', institutionId: 'inst-2', name: 'CLB Room 1', capacity: 150, location: 'Juja Main', floor: 2, amenities: ['Whiteboard', 'Smart Screen'] },
  { id: 'v6', institutionId: 'inst-2', name: 'SBC Lab', capacity: 50, location: 'Academic Wing', floor: 3, amenities: ['High Performance PCs'] },
  
  // Moi University Venues
  { id: 'v7', institutionId: 'inst-3', name: 'Admin Block Hall', capacity: 300, location: 'Kesses Main', floor: 1, amenities: ['Classic Seating', 'Stage'] },
  { id: 'v8', institutionId: 'inst-3', name: 'Annex Campus Hall', capacity: 200, location: 'Eldoret Town', floor: 1, amenities: ['Audio Visuals'] },
  
  // Egerton University Venues
  { id: 'v9', institutionId: 'inst-4', name: 'ARC Hotel Hall', capacity: 250, location: 'Njoro Campus', floor: 1, amenities: ['Hotel Services', 'AC'] },
  { id: 'v10', institutionId: 'inst-4', name: 'Kilimo Hall', capacity: 1000, location: 'Njoro Campus', floor: 1, amenities: ['PA System', 'Large Capacity'] },
  
  // UoE Venues
  { id: 'v11', institutionId: 'inst-5', name: 'Town Campus Auditorium', capacity: 150, location: 'Eldoret Town', floor: 2, amenities: ['Projector', 'Wi-Fi'] },
  { id: 'v12', institutionId: 'inst-5', name: 'Main Campus Theatre', capacity: 450, location: 'Main Campus', floor: 1, amenities: ['Stage Lighting', 'Audio System'] },
];

export const MOCK_USERS = [
  // inst-1: University of Nairobi
  { id: 'u1', name: 'Admin UoN', email: 'admin@uonbi.ac.ke', role: UserRole.ADMIN, institutionId: 'inst-1', avatar: 'https://i.pravatar.cc/150?u=uon_admin' },
  { id: 'u2', name: 'Prof. Peter Mbithi', email: 'mbithi@uonbi.ac.ke', role: UserRole.LECTURER, institutionId: 'inst-1', avatar: 'https://i.pravatar.cc/150?u=uon_lec' },
  { id: 'u3', name: 'Kevin Otieno', email: 'kevin@students.uonbi.ac.ke', role: UserRole.CLASS_REP, institutionId: 'inst-1', avatar: 'https://i.pravatar.cc/150?u=uon_rep' },
  { id: 'u4', name: 'Mary Wambui', email: 'mary@students.uonbi.ac.ke', role: UserRole.STUDENT, institutionId: 'inst-1', avatar: 'https://i.pravatar.cc/150?u=uon_stu' },
  
  // inst-2: JKUAT
  { id: 'u5', name: 'Admin JKUAT', email: 'admin@jkuat.ac.ke', role: UserRole.ADMIN, institutionId: 'inst-2', avatar: 'https://i.pravatar.cc/150?u=jku_admin' },
  { id: 'u6', name: 'Dr. Jane Kariuki', email: 'jkariuki@jkuat.ac.ke', role: UserRole.LECTURER, institutionId: 'inst-2', avatar: 'https://i.pravatar.cc/150?u=jku_lec' },
  { id: 'u7', name: 'Brian Mutua', email: 'brian@students.jkuat.ac.ke', role: UserRole.CLASS_REP, institutionId: 'inst-2', avatar: 'https://i.pravatar.cc/150?u=jku_rep' },
  { id: 'u8', name: 'Sarah Njeri', email: 'sarah@students.jkuat.ac.ke', role: UserRole.STUDENT, institutionId: 'inst-2', avatar: 'https://i.pravatar.cc/150?u=jku_stu' },
  
  // inst-3: Moi University
  { id: 'u9', name: 'Admin Moi', email: 'admin@moi.ac.ke', role: UserRole.ADMIN, institutionId: 'inst-3', avatar: 'https://i.pravatar.cc/150?u=moi_admin' },
  { id: 'u10', name: 'Prof. Richard Mibey', email: 'mibey@moi.ac.ke', role: UserRole.LECTURER, institutionId: 'inst-3', avatar: 'https://i.pravatar.cc/150?u=moi_lec' },
  { id: 'u11', name: 'Dennis Kimutai', email: 'dennis@students.moi.ac.ke', role: UserRole.CLASS_REP, institutionId: 'inst-3', avatar: 'https://i.pravatar.cc/150?u=moi_rep' },
  { id: 'u12', name: 'Lydia Chebet', email: 'lydia@students.moi.ac.ke', role: UserRole.STUDENT, institutionId: 'inst-3', avatar: 'https://i.pravatar.cc/150?u=moi_stu' },
  
  // inst-4: Egerton University
  { id: 'u13', name: 'Admin Egerton', email: 'admin@egerton.ac.ke', role: UserRole.ADMIN, institutionId: 'inst-4', avatar: 'https://i.pravatar.cc/150?u=eu_admin' },
  { id: 'u14', name: 'Dr. Samuel Njoroge', email: 'snjoroge@egerton.ac.ke', role: UserRole.LECTURER, institutionId: 'inst-4', avatar: 'https://i.pravatar.cc/150?u=eu_lec' },
  { id: 'u15', name: 'Faith Maina', email: 'faith@students.egerton.ac.ke', role: UserRole.CLASS_REP, institutionId: 'inst-4', avatar: 'https://i.pravatar.cc/150?u=eu_rep' },
  { id: 'u16', name: 'Peter Mwangi', email: 'peter@students.egerton.ac.ke', role: UserRole.STUDENT, institutionId: 'inst-4', avatar: 'https://i.pravatar.cc/150?u=eu_stu' },
  
  // inst-5: University of Eldoret
  { id: 'u17', name: 'Admin UoE', email: 'admin@uoeld.ac.ke', role: UserRole.ADMIN, institutionId: 'inst-5', avatar: 'https://i.pravatar.cc/150?u=uoe_admin' },
  { id: 'u18', name: 'Linda Chepkoech', email: 'lchep@uoeld.ac.ke', role: UserRole.LECTURER, institutionId: 'inst-5', avatar: 'https://i.pravatar.cc/150?u=uoe_lec' },
  { id: 'u19', name: 'Aggrey Wekesa', email: 'aggrey@students.uoeld.ac.ke', role: UserRole.CLASS_REP, institutionId: 'inst-5', avatar: 'https://i.pravatar.cc/150?u=uoe_rep' },
  { id: 'u20', name: 'Naomi Juma', email: 'naomi@students.uoeld.ac.ke', role: UserRole.STUDENT, institutionId: 'inst-5', avatar: 'https://i.pravatar.cc/150?u=uoe_stu' },
];

export const TRANSITIONS = {
  standard: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  fast: 'transition-all duration-150 ease-in-out',
};

// Initial Mock Chats
export const INITIAL_CONVERSATIONS: Conversation[] = [
  { id: 'c1', title: 'Academic Plaza (General)', lastMessage: 'Please ensure Taifa Hall is clear by 10 AM.', lastTimestamp: '10:45 AM', type: 'channel', participants: [], targetRole: UserRole.STUDENT },
  { id: 'c2', title: 'Lecturers Lounge', lastMessage: 'Exam schedules for next week are ready.', lastTimestamp: '09:30 AM', type: 'channel', participants: [], targetRole: UserRole.LECTURER },
  { id: 'c3', title: 'Admin Support Desk', lastMessage: 'We received your booking request.', lastTimestamp: 'Yesterday', type: 'direct', participants: [], targetRole: UserRole.ADMIN },
  { id: 'c4', title: 'Class Rep Hub', lastMessage: 'Meeting tomorrow at MPH.', lastTimestamp: '08:15 AM', type: 'channel', participants: [], targetRole: UserRole.CLASS_REP },
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'c1': [
    { id: 'm1', senderId: 'u1', text: 'Good morning everyone. Campus venues are open.', timestamp: '08:00 AM', role: UserRole.ADMIN },
    { id: 'm2', senderId: 'u4', text: 'Is Taifa Hall available for the gala?', timestamp: '08:05 AM', role: UserRole.STUDENT },
    { id: 'm3', senderId: 'u1', text: 'Please check the live registry in the Book tab.', timestamp: '08:07 AM', role: UserRole.ADMIN },
  ],
  'c2': [
    { id: 'm4', senderId: 'u2', text: 'Did anyone find a flash drive in Gandhi Wing?', timestamp: '09:00 AM', role: UserRole.LECTURER },
    { id: 'm5', senderId: 'u6', text: 'I think the janitors have it at the reception.', timestamp: '09:15 AM', role: UserRole.LECTURER },
  ],
  'c3': [
    { id: 'm6', senderId: 'u1', text: 'How can I assist you with your venue sync today?', timestamp: 'Yesterday', role: UserRole.ADMIN },
  ]
};
