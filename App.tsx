import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserRole, Venue, Booking, BookingStatus } from './types';
import { AppLayout } from './components/Layout';
import { Card, Button, Input, Badge, Avatar } from './components/UI';
import { MOCK_USERS, ROLE_COLORS } from './constants';
import { mockApi } from './services/mockApi';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  // Initialize darkMode from localStorage for persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('seatsync_theme');
    return saved === 'dark';
  });

  // Auth States
  const [email, setEmail] = useState('james@campus.edu');
  const [password, setPassword] = useState('password');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Save theme preference whenever it changes
  useEffect(() => {
    localStorage.setItem('seatsync_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const initData = useCallback(async () => {
    setLoading(true);
    const [vData, bData] = await Promise.all([
      mockApi.fetchVenues(),
      mockApi.fetchBookings()
    ]);
    setVenues(vData);
    setBookings(bData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) initData();
  }, [currentUser, initData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      setCurrentUser(user as User);
    } else {
      alert("User not found");
    }
  };

  const handleApprove = async (id: string) => {
    await mockApi.updateBookingStatus(id, BookingStatus.CONFIRMED);
    initData();
  };

  const handleReject = async (id: string) => {
    await mockApi.updateBookingStatus(id, BookingStatus.CANCELLED);
    initData();
  };

  const handleCancel = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      await mockApi.updateBookingStatus(id, BookingStatus.CANCELLED);
      initData();
    }
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  if (showSplash) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto bg-[#043C5C] items-center justify-center text-white">
        <div className="animate-bounce mb-4 bg-white p-4 rounded-3xl shadow-2xl">
          <svg className="w-16 h-16 text-[#043C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div className="flex flex-col items-center animate-pulse">
          <h1 className="text-4xl font-black tracking-tighter">SEATSYNC</h1>
          <p className="text-[#E1D4B7] font-medium tracking-widest mt-2">Campus Intelligence</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`flex flex-col h-screen max-w-md mx-auto p-8 overflow-y-auto transition-colors duration-500 ${darkMode ? 'bg-[#021019] dark' : 'bg-[#FFFFD0]'}`}>
        <div className="flex justify-end mb-4">
          <button 
            onClick={toggleDarkMode}
            className="p-3 rounded-2xl bg-white/10 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#043C5C] dark:hover:text-white transition-all shadow-sm border border-black/5 dark:border-white/5"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 16.243l.707.707M7.757 7.757l.707-.707M7 12a5 5 0 1110 0 5 5 0 01-10 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>
        <div className="mt-4 mb-10">
          <h1 className="text-4xl font-bold text-[#043C5C] dark:text-slate-100 tracking-tight">Welcome to <span className="text-[#E1D4B7]">SeatSync</span></h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Academic venue management system.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <Input 
            label="Email Address" 
            placeholder="james@campus.edu" 
            value={email} 
            onChange={setEmail} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={setPassword}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          />
          <Button type="submit" className="mt-4 shadow-xl">Login to System</Button>
        </form>

        <div className="mt-10 p-4 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-black/5 dark:border-white/5 backdrop-blur-md">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Quick Roles</h4>
          <div className="grid grid-cols-2 gap-2">
            <RoleBadge email="admin@campus.edu" label="Admin" color={ROLE_COLORS.ADMIN} onClick={setEmail} />
            <RoleBadge email="james@campus.edu" label="Lecturer" color={ROLE_COLORS.LECTURER} onClick={setEmail} />
            <RoleBadge email="sarah@student.edu" label="Class Rep" color={ROLE_COLORS.CLASS_REP} onClick={setEmail} />
            <RoleBadge email="mark@student.edu" label="Student" color={ROLE_COLORS.STUDENT} onClick={setEmail} />
          </div>
        </div>
      </div>
    );
  }

  const canBook = currentUser.role !== UserRole.STUDENT;

  return (
    <AppLayout 
      role={currentUser.role} 
      userName={currentUser.name} 
      activeTab={activeTab} 
      onTabChange={(tab) => {
        if (tab === 'book' && !canBook) return;
        setActiveTab(tab);
      }}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
    >
      {loading && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#043C5C] to-transparent animate-shimmer z-[100]"></div>
      )}
      
      {activeTab === 'home' && (
        <HomeView 
          user={currentUser} 
          venues={venues} 
          bookings={bookings} 
          onApprove={handleApprove}
          onReject={handleReject}
          onTabChange={setActiveTab}
        />
      )}
      {activeTab === 'book' && canBook && (
        <BookView 
          venues={venues} 
          bookings={bookings}
          onBooked={initData} 
          user={currentUser} 
          onNavigateHome={() => setActiveTab('home')}
        />
      )}
      {activeTab === 'my-bookings' && (
        <MyBookingsView 
          user={currentUser} 
          venues={venues} 
          bookings={bookings} 
          onCancel={handleCancel}
        />
      )}
      {activeTab === 'approvals' && currentUser.role === UserRole.ADMIN && (
        <ApprovalsView 
          bookings={bookings} 
          venues={venues} 
          onApprove={handleApprove} 
          onReject={handleReject} 
        />
      )}
      {activeTab === 'schedule' && <ScheduleView bookings={bookings} venues={venues} role={currentUser.role} />}
      {activeTab === 'profile' && <ProfileView user={currentUser} onLogout={() => setCurrentUser(null)} />}
    </AppLayout>
  );
}

const RoleBadge = ({ email, label, color, onClick }: any) => (
  <button 
    onClick={() => onClick(email)}
    style={{ borderColor: color, color: color, backgroundColor: `${color}10` }}
    className="px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider text-center transition-all hover:scale-105 active:scale-95 bg-white/20 dark:bg-black/20 backdrop-blur-sm"
  >
    {label}
  </button>
);

// --- VIEWS ---

function HomeView({ user, venues, bookings, onApprove, onReject, onTabChange }: { 
  user: User; 
  venues: Venue[]; 
  bookings: Booking[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onTabChange: (tab: string) => void;
}) {
  const activeBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED);
  const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
  const isAdmin = user.role === UserRole.ADMIN;
  const roleColor = ROLE_COLORS[user.role];

  return (
    <div className="py-2 animate-fadeIn">
      <div className="grid grid-cols-3 gap-3 mb-8 mt-4">
        <StatCard label="Venues" val={venues.length.toString()} color={ROLE_COLORS[user.role]} />
        <StatCard label="Live" val={activeBookings.length.toString()} color="#10B981" />
        <StatCard label="Waiting" val={pendingBookings.length.toString()} color="#FB923C" />
      </div>

      {isAdmin && pendingBookings.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-[#043C5C] dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: roleColor }}></span>
              Approval Queue
            </h3>
            <button onClick={() => onTabChange('approvals')} className="text-[10px] font-bold text-[#043C5C] dark:text-slate-400 uppercase">Manage All</button>
          </div>
          <div className="flex flex-col gap-3">
            {pendingBookings.slice(0, 2).map(booking => (
              <Card key={booking.id} role={UserRole.ADMIN} className="animate-slideUp border-l-4 border-l-[#A78BFA] bg-white/60 dark:bg-slate-900/40">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-[#043C5C] dark:text-slate-100">{booking.purpose}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {venues.find(v => v.id === booking.venueId)?.name} • {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                  <Badge type="warning">Review</Badge>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => onApprove(booking.id)} variant="primary" className="flex-1 !py-2 text-[11px]">Approve</Button>
                  <Button onClick={() => onReject(booking.id)} variant="outline" className="flex-1 !py-2 text-[11px] !border-slate-300 !text-slate-500 dark:!border-slate-700">Reject</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Timeline</h3>
        </div>
        <div className="flex flex-col gap-3">
          {activeBookings.length > 0 ? (
            activeBookings.map(booking => (
              <Card key={booking.id} role={user.role} className="group overflow-hidden border-l-4 bg-white/60 dark:bg-slate-900/40">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#043C5C] dark:text-slate-100">{booking.purpose}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      {venues.find(v => v.id === booking.venueId)?.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">{booking.startTime} - {booking.endTime}</p>
                  </div>
                  <Badge type="success">Live</Badge>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center gap-4 bg-white/40 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
               <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">No live events today.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MyBookingsView({ user, venues, bookings, onCancel }: { 
  user: User; 
  venues: Venue[]; 
  bookings: Booking[]; 
  onCancel: (id: string) => void;
}) {
  const userBookings = bookings.filter(b => b.userId === user.id).reverse();
  const roleColor = ROLE_COLORS[user.role];

  return (
    <div className="py-4 animate-fadeIn">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#043C5C] dark:text-slate-100">My Reservations</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Manage your venue booking history</p>
      </div>

      {userBookings.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white/30 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 font-bold">You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {userBookings.map(booking => {
            const venue = venues.find(v => v.id === booking.venueId);
            const isCancelled = booking.status === BookingStatus.CANCELLED;
            const isPending = booking.status === BookingStatus.PENDING;
            
            return (
              <Card key={booking.id} role={user.role} className={`border-l-4 animate-slideUp ${isCancelled ? 'opacity-60 grayscale' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className={`font-bold ${isCancelled ? 'text-slate-500' : 'text-[#043C5C] dark:text-slate-100'}`}>{booking.purpose}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{venue?.name}</p>
                  </div>
                  <Badge type={booking.status === BookingStatus.CONFIRMED ? 'success' : booking.status === BookingStatus.PENDING ? 'warning' : 'danger'}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {booking.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /></svg>
                    {booking.startTime} - {booking.endTime}
                  </span>
                </div>
                {!isCancelled && (
                  <div className="flex justify-end mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => onCancel(booking.id)}
                      className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Cancel Booking
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ApprovalsView({ bookings, venues, onApprove, onReject }: { 
  bookings: Booking[]; 
  venues: Venue[]; 
  onApprove: (id: string) => void; 
  onReject: (id: string) => void;
}) {
  const pending = bookings.filter(b => b.status === BookingStatus.PENDING);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setConfirmingId(id);
    if (action === 'approve') await onApprove(id);
    else await onReject(id);
    setConfirmingId(null);
  };
  
  return (
    <div className="py-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-[#043C5C] dark:text-slate-100">Live Confirmations</h3>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Approval Hub Active
          </p>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white/30 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 animate-bounce">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider">Queue Cleared</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {pending.map(booking => (
            <Card key={booking.id} role={UserRole.ADMIN} className="border-l-4 animate-slideUp overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-black text-[#043C5C] dark:text-slate-100 group-hover:text-[#0EA5E9] transition-colors">{booking.purpose}</h4>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {venues.find(v => v.id === booking.venueId)?.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {booking.date} • {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </div>
                <Avatar size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  onClick={() => handleAction(booking.id, 'approve')} 
                  disabled={confirmingId === booking.id}
                  variant="primary" 
                  className="!py-2.5 shadow-lg shadow-[#043C5C]/20 text-xs"
                >
                  {confirmingId === booking.id ? 'Processing...' : 'Confirm Venue'}
                </Button>
                <Button 
                  onClick={() => handleAction(booking.id, 'reject')} 
                  disabled={confirmingId === booking.id}
                  variant="outline" 
                  className="!py-2.5 !text-rose-500 !border-rose-100 dark:!border-slate-800 text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function BookView({ venues, bookings, onBooked, user, onNavigateHome }: { venues: Venue[]; bookings: Booking[]; onBooked: () => void; user: User; onNavigateHome: () => void }) {
  const [selectedVenue, setSelectedVenue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('11:00');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isConflict, setIsConflict] = useState(false);
  const roleColor = ROLE_COLORS[user.role];

  // Logic for the Mini Legend Map
  const venueStatuses = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTimeStr = now.toTimeString().split(' ')[0].substring(0, 5); // HH:mm

    return venues.map(v => {
      const vBookings = bookings.filter(b => b.venueId === v.id && b.date === today && b.status === BookingStatus.CONFIRMED);
      
      const active = vBookings.find(b => currentTimeStr >= b.startTime && currentTimeStr < b.endTime);
      if (active) return { id: v.id, name: v.name, status: 'IN_USE' };

      const later = vBookings.find(b => b.startTime > currentTimeStr);
      if (later) return { id: v.id, name: v.name, status: 'BOOKED' };

      return { id: v.id, name: v.name, status: 'AVAILABLE' };
    });
  }, [venues, bookings]);

  useEffect(() => {
    if (selectedVenue && date && start && end) {
      const conflict = mockApi.checkConflict(selectedVenue, date, start, end);
      setIsConflict(conflict);
      setError(conflict ? 'Conflict: This venue is already occupied for the selected time slot.' : '');
    }
  }, [selectedVenue, date, start, end]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenue || !purpose) return setError('Please fill all fields');
    if (isConflict) return;
    
    setIsSubmitting(true);
    try {
      await mockApi.createBooking({
        userId: user.id,
        venueId: selectedVenue,
        date,
        startTime: start,
        endTime: end,
        purpose
      }, user.role);
      
      // Artificial delay for better loading experience
      await new Promise(r => setTimeout(r, 800));
      
      setIsSubmitting(false);
      setIsSuccess(true);
      onBooked();
      
      // Auto-navigate after a success dwell time
      setTimeout(() => {
        onNavigateHome();
      }, 2500);
      
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-fadeIn text-center p-6 bg-[#FFFFD0]/50 dark:bg-[#021019]/50 rounded-[40px]">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl animate-successCheck relative z-10">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
        </div>
        <h2 className="text-3xl font-black text-[#043C5C] dark:text-slate-100 tracking-tight">Booking Secured</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xs mx-auto font-medium">
          {user.role === UserRole.ADMIN 
            ? "Reserved immediately. The campus schedule has been synchronized." 
            : "Request queued. An administrator will review your reservation shortly."}
        </p>
        <div className="mt-12 flex flex-col w-full gap-4 animate-slideUp">
          <Button variant="primary" onClick={onNavigateHome} className="shadow-lg shadow-[#043C5C]/20">Return to Dashboard</Button>
          <button onClick={() => setIsSuccess(false)} className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Book Another Venue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 animate-slideUp">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#043C5C] dark:text-slate-100">Reserve Venue</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Real-time campus availability glimpse</p>
      </div>

      {/* Mini Legend Map */}
      <section className="mb-8 p-4 bg-white/50 dark:bg-slate-900/30 rounded-3xl border border-white dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 px-1">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Venue Status Map</h4>
          <div className="flex gap-3">
            <LegendItem dot="#10B981" label="Available" />
            <LegendItem dot="#FB923C" label="Booked" />
            <LegendItem dot="#EF4444" label="In-use" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {venueStatuses.map(vs => (
            <div 
              key={vs.id} 
              onClick={() => setSelectedVenue(vs.id)}
              className={`h-12 rounded-xl flex items-center justify-center relative cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${selectedVenue === vs.id ? 'ring-2 ring-offset-2 ring-[#043C5C] dark:ring-[#0EA5E9]' : ''}`}
              style={{ backgroundColor: vs.status === 'AVAILABLE' ? '#10B98120' : vs.status === 'BOOKED' ? '#FB923C20' : '#EF444420' }}
            >
              <div 
                className={`w-2 h-2 rounded-full mb-1 ${vs.status === 'IN_USE' ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: vs.status === 'AVAILABLE' ? '#10B981' : vs.status === 'BOOKED' ? '#FB923C' : '#EF4444' }}
              ></div>
              <span className="absolute bottom-1 text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">{vs.name.split(' ').pop()}</span>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleBooking} className="flex flex-col gap-6 relative">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/60 dark:bg-[#021019]/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center rounded-3xl transition-all duration-500">
             <div className="w-12 h-12 border-4 border-[#043C5C] border-t-transparent dark:border-[#0EA5E9] dark:border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-4 text-[10px] font-black uppercase text-[#043C5C] dark:text-[#0EA5E9] tracking-widest">Validating...</p>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Select Venue</label>
          <select 
            value={selectedVenue} 
            onChange={e => setSelectedVenue(e.target.value)}
            className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#043C5C]/20 transition-all ${isConflict && selectedVenue ? 'animate-shake border-rose-500 ring-rose-500/20 shadow-sm shadow-rose-500/10' : 'border-slate-200 dark:border-slate-800'}`}
          >
            <option value="">Choose Venue...</option>
            {venues.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <Input label="Date" type="date" value={date} onChange={setDate} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start" type="time" value={start} onChange={setStart} />
          <Input label="End" type="time" value={end} onChange={setEnd} />
        </div>
        <Input label="Purpose" placeholder="CS Lecture..." value={purpose} onChange={setPurpose} />

        {error && (
          <div className="animate-fadeIn">
            <p className="text-rose-600 dark:text-rose-400 text-xs font-bold bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/40 flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{error}</span>
            </p>
          </div>
        )}

        <Button disabled={isSubmitting || isConflict} type="submit" role={user.role} className="shadow-xl relative mt-2 group overflow-hidden">
          <span className="relative z-10">{isSubmitting ? 'Syncing...' : 'Complete Reservation'}</span>
        </Button>
      </form>
    </div>
  );
}

const LegendItem = ({ dot, label }: { dot: string; label: string }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot }}></div>
    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{label}</span>
  </div>
);

function ScheduleView({ bookings, venues, role }: { bookings: Booking[]; venues: Venue[]; role: UserRole }) {
  const roleColor = ROLE_COLORS[role];
  return (
    <div className="py-4 animate-fadeIn">
      <h3 className="text-lg font-bold text-[#043C5C] dark:text-slate-100 mb-6">Calendar</h3>
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
          <button 
            key={day} 
            className={`flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${i === 0 ? 'text-white shadow-xl scale-110' : 'bg-white/60 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 border border-white/20 dark:border-slate-800'}`}
            style={i === 0 ? { backgroundColor: roleColor } : {}}
          >
            <span className="text-[10px] font-black">{day}</span>
            <span className="text-lg font-black">{12 + i}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 pl-8 border-l-2 border-l-slate-200 dark:border-l-slate-800 transition-colors duration-500">
        {[
          { time: '09:00', purpose: 'Algorithms 101', venue: 'Hall A' },
          { time: '11:00', purpose: 'Lunch Break', venue: 'Cafeteria' },
          { time: '14:00', purpose: 'Lab Practical', venue: 'Lab 3' },
        ].map(slot => (
          <div key={slot.time} className="relative py-2">
            <div className="absolute -left-[41px] top-4 w-4 h-4 rounded-full border-4 border-[#FFFFD0] dark:border-[#021019] shadow-sm transition-colors duration-500" style={{ backgroundColor: roleColor }}></div>
            <Card role={role} className="border-l-4 bg-white/70 dark:bg-slate-900/40">
              <p className="text-[10px] font-bold uppercase mb-1" style={{ color: roleColor }}>{slot.time}</p>
              <h4 className="font-bold text-[#043C5C] dark:text-slate-100">{slot.purpose}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{slot.venue}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ user, onLogout }: { user: User; onLogout: () => void }) {
  const roleColor = ROLE_COLORS[user.role];
  return (
    <div className="py-4 animate-fadeIn">
      <div className="flex flex-col items-center gap-4 py-8">
        <Avatar src={user.avatar} size="lg" role={user.role} />
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#043C5C] dark:text-slate-100">{user.name}</h3>
          <p className="text-slate-400 dark:text-slate-500 font-medium">{user.email}</p>
        </div>
        <Badge type="role" role={user.role}>{user.role}</Badge>
      </div>
      <div className="flex flex-col gap-3 mt-4">
        <Card className="flex items-center gap-4 bg-white/40 dark:bg-slate-900/20">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Preferences</span>
        </Card>
        <Button onClick={onLogout} variant="outline" className="w-full mt-4 !text-rose-500 !border-rose-500 hover:!bg-rose-500 hover:!text-white shadow-sm">
          Log Out
        </Button>
      </div>
    </div>
  );
}

const StatCard = ({ label, val, color }: { label: string; val: string; color: string }) => (
  <div 
    style={{ backgroundColor: `${color}15`, borderColor: `${color}30`, color: color }}
    className="p-4 rounded-3xl border flex flex-col items-center justify-center gap-1 shadow-sm transition-all hover:scale-105 bg-white/30 dark:bg-black/20 backdrop-blur-sm"
  >
    <span className="text-[10px] font-black uppercase tracking-wider opacity-80">{label}</span>
    <span className="text-2xl font-black">{val}</span>
  </div>
);