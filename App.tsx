
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserRole, Venue, Booking, BookingStatus, Institution } from './types';
import { AppLayout } from './components/Layout';
import { Card, Button, Input, Badge, Avatar } from './components/UI';
import { MOCK_USERS, ROLE_COLORS, MOCK_INSTITUTIONS } from './constants';
import { mockApi } from './services/mockApi';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [loginError, setLoginError] = useState('');
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('seatsync_theme');
    return saved === 'dark';
  });

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('seatsync_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const initData = useCallback(async () => {
    if (!selectedInstitution) return;
    setLoading(true);
    try {
      const [vData, bData] = await Promise.all([
        mockApi.fetchVenues(selectedInstitution.id),
        mockApi.fetchBookings(selectedInstitution.id)
      ]);
      setVenues(vData);
      setBookings(bData);
    } catch (err) {
      console.error("Failed to load portal data", err);
    } finally {
      setLoading(false);
    }
  }, [selectedInstitution]);

  useEffect(() => {
    if (currentUser) initData();
  }, [currentUser, initData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstitution) return;
    
    setLoginError('');
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.institutionId === selectedInstitution.id);
    
    if (user) {
      setCurrentUser(user as User);
    } else {
      setLoginError(`Invalid credentials for the ${selectedInstitution.shortName} portal.`);
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
      <div className="flex flex-col h-screen max-w-md mx-auto bg-[#043C5C] items-center justify-center text-white p-6">
        <div className="animate-bounce mb-6 bg-white p-5 rounded-[2.5rem] shadow-2xl">
          <svg className="w-16 h-16 text-[#043C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div className="flex flex-col items-center animate-pulse">
          <h1 className="text-4xl font-black tracking-tighter text-white">SEATSYNC</h1>
          <p className="text-[#E1D4B7] font-medium tracking-widest mt-2 uppercase text-xs">Academic Portal Entry</p>
        </div>
      </div>
    );
  }

  // Institutional Selection Flow
  if (!selectedInstitution) {
    return (
      <div className={`flex flex-col h-screen max-w-md mx-auto p-6 md:p-10 transition-colors duration-500 overflow-y-auto ${darkMode ? 'bg-[#021019] text-white' : 'bg-[#FFFFD0]'}`}>
        <div className="mt-8 mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-[#043C5C] dark:text-slate-100 tracking-tight leading-none mb-2">Campus <span className="text-[#0EA5E9]">Portals</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Select your Kenyan institution to continue</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {MOCK_INSTITUTIONS.map(inst => (
            <div 
              key={inst.id}
              onClick={() => {
                setSelectedInstitution(inst);
                // Pre-fill with admin by default for demo
                const adminUser = MOCK_USERS.find(u => u.institutionId === inst.id && u.role === UserRole.ADMIN);
                if (adminUser) setEmail(adminUser.email);
              }}
              className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md p-5 rounded-[2.2rem] border border-black/5 dark:border-white/5 shadow-sm hover:shadow-2xl hover:scale-[1.02] active:scale-95 cursor-pointer transition-all flex items-center gap-5 group"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-6 transition-transform"
                style={{ backgroundColor: inst.color }}
              >
                {inst.shortName[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-[#043C5C] dark:text-slate-100 leading-tight">{inst.name}</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">{inst.code}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-[#043C5C] dark:text-[#E1D4B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-auto py-10 text-center opacity-40">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SeatSync Kenya v3.0</p>
        </div>
      </div>
    );
  }

  // Institutional Login Screen
  if (!currentUser) {
    const institutionUsers = MOCK_USERS
      .filter(u => u.institutionId === selectedInstitution.id)
      .sort((a, b) => {
        const order = [UserRole.ADMIN, UserRole.LECTURER, UserRole.CLASS_REP, UserRole.STUDENT];
        return order.indexOf(a.role) - order.indexOf(b.role);
      });

    return (
      <div className={`flex flex-col h-screen max-w-md mx-auto p-6 md:p-10 overflow-y-auto transition-colors duration-500 ${darkMode ? 'bg-[#021019] dark' : 'bg-[#FFFFD0]'}`}>
        <button 
          onClick={() => {
            setSelectedInstitution(null);
            setLoginError('');
          }}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-12 hover:text-[#043C5C] group transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </div>
          Change Institution
        </button>

        <div className="mb-10 text-center">
           <div 
             className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white font-black text-3xl shadow-2xl"
             style={{ backgroundColor: selectedInstitution.color }}
           >
             {selectedInstitution.shortName[0]}
           </div>
           <h2 className="text-2xl font-black text-[#043C5C] dark:text-slate-100">{selectedInstitution.name}</h2>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Portal Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <Input 
            label="Email Address" 
            placeholder="user@university.ac.ke" 
            value={email} 
            onChange={setEmail} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>}
          />
          <Input 
            label="Portal Password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={setPassword}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          />
          
          {loginError && (
            <div className="animate-shake p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
              <p className="text-rose-600 dark:text-rose-400 text-xs font-bold text-center leading-relaxed">{loginError}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="mt-4 shadow-xl text-lg font-bold py-4 rounded-2xl"
            style={{ backgroundColor: selectedInstitution.color }}
          >
            Log in to {selectedInstitution.shortName}
          </Button>
        </form>

        <div className="mt-12">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-6">Demo Directory: Select a Role</p>
          <div className="flex flex-col gap-2">
            {institutionUsers.map(u => (
              <button 
                key={u.id}
                onClick={() => setEmail(u.email)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3 text-left">
                  <Avatar src={u.avatar} size="sm" role={u.role} />
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{u.name}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ROLE_COLORS[u.role] }}></div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{u.role}</p>
                    </div>
                  </div>
                </div>
                <div className="text-[9px] font-black text-slate-300 group-hover:text-[#0EA5E9] transition-colors">{u.email}</div>
              </button>
            ))}
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
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer z-[100]"></div>
      )}

      {/* Persistent Campus Breadcrumb */}
      <div className="mt-6 mb-2 flex items-center justify-between px-2">
        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/40 py-2 px-3 rounded-full border border-black/5 dark:border-white/5 backdrop-blur-sm">
          <div 
            className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[9px] font-black"
            style={{ backgroundColor: selectedInstitution.color }}
          >
            {selectedInstitution.shortName[0]}
          </div>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {selectedInstitution.name}
          </span>
        </div>
      </div>
      
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
          institutionId={selectedInstitution.id}
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
      {activeTab === 'profile' && (
        <ProfileView 
          user={currentUser} 
          institution={selectedInstitution} 
          onLogout={() => {
            setCurrentUser(null);
            setSelectedInstitution(null);
          }} 
        />
      )}
    </AppLayout>
  );
}

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
    <div className="py-2 animate-fadeIn space-y-8">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <StatCard label="Campus Venues" val={venues.length.toString()} color={ROLE_COLORS[user.role]} />
        <StatCard label="Live Now" val={activeBookings.length.toString()} color="#10B981" />
        <StatCard label="In Queue" val={pendingBookings.length.toString()} color="#FB923C" />
      </div>

      {isAdmin && pendingBookings.length > 0 && (
        <section className="animate-slideUp">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-[#043C5C] dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: roleColor }}></span>
              Review Queue
            </h3>
            <button onClick={() => onTabChange('approvals')} className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">See All</button>
          </div>
          <div className="space-y-3">
            {pendingBookings.slice(0, 1).map(booking => (
              <Card key={booking.id} role={UserRole.ADMIN} className="border-l-4 shadow-md bg-white dark:bg-slate-900/60 p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="max-w-[70%]">
                    <h4 className="font-bold text-[#043C5C] dark:text-slate-100 text-lg leading-tight">{booking.purpose}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {venues.find(v => v.id === booking.venueId)?.name}
                    </p>
                  </div>
                  <Badge type="warning">Review</Badge>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => onApprove(booking.id)} className="flex-1 !py-2.5 !text-xs">Approve</Button>
                  <Button onClick={() => onReject(booking.id)} variant="outline" className="flex-1 !py-2.5 !text-xs">Decline</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Schedule</h3>
        </div>
        <div className="space-y-4">
          {activeBookings.length > 0 ? (
            activeBookings.map(booking => (
              <Card key={booking.id} role={user.role} className="border-l-4 bg-white/80 dark:bg-slate-900/60 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-[#043C5C] dark:text-slate-100">{booking.purpose}</h4>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">{venues.find(v => v.id === booking.venueId)?.name}</span>
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{booking.startTime} - {booking.endTime}</span>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-16 text-center bg-white/30 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-black/5 dark:border-white/5">
               <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">No active sessions right now</p>
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

  return (
    <div className="py-4 animate-fadeIn">
      <div className="mb-8 mt-2">
        <h3 className="text-3xl font-black text-[#043C5C] dark:text-slate-100 tracking-tight">Your Desk</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Active & Past Reservations</p>
      </div>

      {userBookings.length === 0 ? (
        <div className="py-24 text-center bg-white/40 dark:bg-slate-900/40 rounded-[3rem] border border-black/5 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /></svg>
          </div>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No reservations found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userBookings.map(booking => {
            const venue = venues.find(v => v.id === booking.venueId);
            const isCancelled = booking.status === BookingStatus.CANCELLED;
            
            return (
              <Card key={booking.id} role={user.role} className={`transition-all ${isCancelled ? 'opacity-50 grayscale scale-95' : 'hover:scale-[1.02]'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#043C5C] dark:text-slate-100">{booking.purpose}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wide">{venue?.name}</p>
                  </div>
                  <Badge type={booking.status === BookingStatus.CONFIRMED ? 'success' : booking.status === BookingStatus.PENDING ? 'warning' : 'danger'}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-t border-black/5 dark:border-white/5 pt-3">
                  <span>{booking.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                {!isCancelled && (
                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={() => onCancel(booking.id)}
                      className="text-[9px] font-black uppercase text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Revoke
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
      <div className="mb-8 mt-2">
        <h3 className="text-3xl font-black text-[#043C5C] dark:text-slate-100 tracking-tight leading-none">Review Desk</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Pending Authorizations
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="py-24 text-center bg-white/40 dark:bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-black/5 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 animate-successCheck">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Queue Clear</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.map(booking => (
            <Card key={booking.id} role={UserRole.ADMIN} className="p-6 border-l-8 animate-slideUp group relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-black text-[#043C5C] dark:text-slate-100 leading-tight mb-2 group-hover:text-blue-500 transition-colors">{booking.purpose}</h4>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                        {venues.find(v => v.id === booking.venueId)?.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </div>
                  </div>
                  <Avatar size="sm" role={UserRole.ADMIN} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                  <Button 
                    onClick={() => handleAction(booking.id, 'approve')} 
                    disabled={confirmingId === booking.id}
                    className="!py-3 !text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
                  >
                    {confirmingId === booking.id ? 'Authorizing...' : 'Authorize'}
                  </Button>
                  <Button 
                    onClick={() => handleAction(booking.id, 'reject')} 
                    disabled={confirmingId === booking.id}
                    variant="outline" 
                    className="!py-3 !text-[11px] font-black uppercase tracking-widest !text-rose-500 !border-rose-100 dark:!border-white/5"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileView({ user, institution, onLogout }: { user: User; institution: Institution; onLogout: () => void }) {
  return (
    <div className="py-4 animate-fadeIn">
      <div className="flex flex-col items-center gap-6 py-10 bg-white/40 dark:bg-slate-900/40 rounded-[3rem] border border-black/5 mb-8">
        <div className="relative">
          <Avatar src={user.avatar} size="lg" role={user.role} />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border-2 border-slate-50 dark:border-slate-900">
             <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
          </div>
        </div>
        <div className="text-center px-6">
          <h3 className="text-3xl font-black text-[#043C5C] dark:text-slate-100 tracking-tight">{user.name}</h3>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 mb-6">{user.email}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge type="role" role={user.role}>{user.role}</Badge>
            <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {institution.shortName} Access
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="p-6 bg-[#043C5C]/5 dark:bg-slate-900/60 rounded-[2.5rem] border border-black/5 dark:border-white/5">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Institution Details</p>
           <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black"
                style={{ backgroundColor: institution.color }}
              >
                {institution.shortName[0]}
              </div>
              <div className="flex-1">
                <span className="block text-sm font-black text-[#043C5C] dark:text-slate-300 leading-tight">{institution.name}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{institution.code}</span>
              </div>
           </div>
        </div>
        <Button 
          onClick={onLogout} 
          variant="outline" 
          className="w-full !py-4 mt-4 !text-rose-500 !border-rose-200 dark:!border-white/5 font-black uppercase tracking-widest hover:!bg-rose-500 hover:!text-white shadow-sm"
        >
          Logout of Portal
        </Button>
      </div>
    </div>
  );
}

const StatCard = ({ label, val, color }: { label: string; val: string; color: string }) => (
  <div 
    style={{ backgroundColor: `${color}10`, borderColor: `${color}20`, color: color }}
    className="p-5 rounded-[2rem] border flex flex-col items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-105 bg-white/20 dark:bg-black/20 backdrop-blur-sm"
  >
    <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-70 text-center leading-none">{label}</span>
    <span className="text-3xl font-black tracking-tighter">{val}</span>
  </div>
);

const LegendItem = ({ dot, label }: { dot: string; label: string }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }}></div>
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
  </div>
);

function BookView({ venues, bookings, onBooked, user, institutionId, onNavigateHome }: { 
  venues: Venue[]; 
  bookings: Booking[]; 
  onBooked: () => void; 
  user: User; 
  institutionId: string;
  onNavigateHome: () => void 
}) {
  const [selectedVenue, setSelectedVenue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('11:00');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isConflict, setIsConflict] = useState(false);

  // REAL-TIME AVAILABILITY UPDATE
  const venueStatuses = useMemo(() => {
    if (!date || !start || !end) return venues.map(v => ({ id: v.id, name: v.name, status: 'AVAILABLE' }));

    const requestedStart = new Date(`${date}T${start}`);
    const requestedEnd = new Date(`${date}T${end}`);

    return venues.map(v => {
      const hasConflict = bookings.some(b => {
        if (b.venueId !== v.id || b.date !== date || b.status === BookingStatus.CANCELLED) return false;
        
        const bStart = new Date(`${date}T${b.startTime}`);
        const bEnd = new Date(`${date}T${b.endTime}`);
        
        return (requestedStart < bEnd && requestedEnd > bStart);
      });

      return { 
        id: v.id, 
        name: v.name, 
        status: hasConflict ? 'TAKEN' : 'AVAILABLE' 
      };
    });
  }, [venues, bookings, date, start, end]);

  useEffect(() => {
    if (selectedVenue && date && start && end) {
      const conflict = mockApi.checkConflict(selectedVenue, date, start, end);
      setIsConflict(conflict);
      setError(conflict ? 'Schedule Conflict: Venue is occupied.' : '');
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
        institutionId: institutionId,
        date,
        startTime: start,
        endTime: end,
        purpose
      }, user.role);
      
      await new Promise(r => setTimeout(r, 800));
      setIsSubmitting(false);
      setIsSuccess(true);
      onBooked();
      setTimeout(() => onNavigateHome(), 2500);
      
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-fadeIn text-center p-8 bg-white/20 dark:bg-black/20 rounded-[3rem] border border-black/5 mt-6">
        <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500 text-white flex items-center justify-center shadow-2xl animate-successCheck mb-8">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-4xl font-black text-[#043C5C] dark:text-slate-100 tracking-tighter mb-4">Success</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-[200px] leading-relaxed">
          Your reservation has been recorded in the campus registry.
        </p>
        <div className="mt-12 flex flex-col w-full gap-4 animate-slideUp">
          <Button variant="primary" onClick={onNavigateHome} className="shadow-2xl font-black uppercase tracking-widest py-4">Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 animate-slideUp">
      <div className="mb-8 mt-2">
        <h3 className="text-3xl font-black text-[#043C5C] dark:text-slate-100 tracking-tight">Reserve Slot</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Campus Venue Registry</p>
      </div>

      <section className="mb-10 p-5 bg-white/60 dark:bg-slate-900/40 rounded-[2.5rem] border border-black/5 shadow-sm">
        <div className="flex items-center justify-between mb-5 px-1">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Venue Status</h4>
          <div className="flex gap-4">
            <LegendItem dot="#10B981" label="Free" />
            <LegendItem dot="#FB923C" label="Taken" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {venueStatuses.map(vs => (
            <div 
              key={vs.id} 
              onClick={() => setSelectedVenue(vs.id)}
              className={`h-16 rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 hover:scale-[1.05] active:scale-95 border-2 ${selectedVenue === vs.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent'}`}
              style={{ backgroundColor: vs.status === 'AVAILABLE' ? '#10B98110' : '#FB923C10' }}
            >
              <div className={`w-2 h-2 rounded-full mb-2 ${vs.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-300 uppercase truncate px-2 w-full text-center">{vs.name.split(' ').pop()}</span>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleBooking} className="space-y-6 pb-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Select Venue</label>
          <select 
            value={selectedVenue} 
            onChange={e => setSelectedVenue(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-2xl px-5 py-4 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 appearance-none shadow-sm"
          >
            <option value="">Choose...</option>
            {venues.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <Input label="Date" type="date" value={date} onChange={setDate} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="From" type="time" value={start} onChange={setStart} />
          <Input label="To" type="time" value={end} onChange={setEnd} />
        </div>
        <Input label="Purpose" placeholder="e.g. CAT, Group Meeting..." value={purpose} onChange={setPurpose} />

        {error && (
          <div className="animate-shake p-4 rounded-2xl bg-rose-50 border border-rose-100">
            <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
          </div>
        )}

        <Button disabled={isSubmitting || isConflict} type="submit" className="w-full !py-5 shadow-2xl mt-4 font-black uppercase tracking-[0.2em] text-lg rounded-[2rem]">
          {isSubmitting ? 'Recording...' : 'Request Slot'}
        </Button>
      </form>
    </div>
  );
}

function ScheduleView({ bookings, venues, role }: { bookings: Booking[]; venues: Venue[]; role: UserRole }) {
  const roleColor = ROLE_COLORS[role];
  return (
    <div className="py-4 animate-fadeIn">
      <div className="mb-8 mt-2">
        <h3 className="text-3xl font-black text-[#043C5C] dark:text-slate-100 tracking-tight leading-none">Global Pulse</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
           Daily Campus Matrix
        </p>
      </div>

      <div className="space-y-6 relative pl-8 border-l-2 border-slate-100 dark:border-white/5 ml-2">
        {bookings.filter(b => b.status === BookingStatus.CONFIRMED).map(slot => (
          <div key={slot.id} className="relative py-2 animate-slideUp">
            <div 
              className="absolute -left-[41px] top-6 w-5 h-5 rounded-full border-[6px] border-[#FFFFD0] dark:border-[#021019] shadow-lg" 
              style={{ backgroundColor: roleColor }}
            ></div>
            <Card role={role} className="p-5 bg-white/80 dark:bg-slate-900/60 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-widest block mb-2" style={{ color: roleColor }}>{slot.startTime}</span>
              <h4 className="text-lg font-bold text-[#043C5C] dark:text-slate-100 leading-tight mb-1">{slot.purpose}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{venues.find(v => v.id === slot.venueId)?.name}</p>
            </Card>
          </div>
        ))}
        {bookings.filter(b => b.status === BookingStatus.CONFIRMED).length === 0 && (
           <div className="py-12 pl-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">
              No active events scheduled
           </div>
        )}
      </div>
    </div>
  );
}
