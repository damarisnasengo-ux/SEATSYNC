
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  MessageCircle,
  User as UserIcon,
  Home,
  Plus,
  Moon,
  Sun,
  ShieldAlert
} from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

import { 
  User, 
  UserRole, 
  Venue, 
  Booking, 
  BookingStatus, 
  Institution 
} from './types';
import { 
  MOCK_USERS, 
  ROLE_COLORS, 
  MOCK_INSTITUTIONS 
} from './constants';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('seatsync_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
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

  if (showSplash) {
    return (
      <div className="Splash">
        <motion.div 
          className="Splash__Logo"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Calendar size={64} color="#043C5C" />
        </motion.div>
        <h1 className="Text__h1">SEATSYNC</h1>
        <p className="Text__label" style={{ color: '#E1D4B7' }}>Academic Portal</p>
      </div>
    );
  }

  if (!selectedInstitution) {
    return (
      <div className="AppContainer" style={{ padding: '40px 24px' }}>
        <header style={{ marginBottom: 40 }}>
          <h1 className="Text__h1" style={{ color: '#043C5C' }}>Campus Portals</h1>
          <p style={{ fontWeight: 500, color: 'var(--color-muted)' }}>Choose your institution to start</p>
        </header>
        <div style={{ display: 'grid', gap: 16 }}>
          {MOCK_INSTITUTIONS.map(inst => (
            <motion.div 
              key={inst.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedInstitution(inst)}
              style={{
                background: 'white',
                padding: 24,
                borderRadius: 24,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                border: '1.5px solid transparent'
              }}
            >
              <div style={{ 
                width: 50, height: 50, borderRadius: 14, background: inst.color, 
                display: 'flex', alignItems: 'center', justifyCenter: 'center', 
                color: 'white', fontWeight: 900, fontSize: '1.2rem',
                justifyContent: 'center'
              }}>
                {inst.shortName[0]}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{inst.name}</h3>
                <p className="Text__label" style={{ fontSize: '0.6rem' }}>{inst.code}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="AppContainer" style={{ padding: '24px' }}>
        <button onClick={() => setSelectedInstitution(null)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-muted)', fontWeight: 700, marginBottom: 40 }}>
          <ArrowLeft size={18} /> BACK
        </button>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, background: selectedInstitution.color, borderRadius: 30, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '2rem' }}>
            {selectedInstitution.shortName[0]}
          </div>
          <h2 className="Text__h2">{selectedInstitution.name}</h2>
          <p className="Text__label">Portal Login</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="InputGroup">
            <span className="Text__label">Institutional Email</span>
            <input className="Input" value={email} onChange={e => setEmail(e.target.value)} placeholder="student@uonbi.ac.ke" />
          </div>
          <div className="InputGroup">
            <span className="Text__label">Password</span>
            <input className="Input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {loginError && <p className="Text__error" style={{ textAlign: 'center' }}>{loginError}</p>}
          <button className="Button Button--primary" type="submit">Authenticate</button>
        </form>
      </div>
    );
  }

  return (
    <AppLayout 
      currentUser={currentUser} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    >
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <HomeSection bookings={bookings} venues={venues} />
          </motion.div>
        )}
        {activeTab === 'book' && (
          <motion.div 
            key="book"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <BookSection 
              venues={venues} 
              bookings={bookings} 
              onSuccess={() => { initData(); setActiveTab('home'); }} 
              user={currentUser}
              institution={selectedInstitution}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

function AppLayout({ children, currentUser, activeTab, onTabChange, darkMode, setDarkMode }: any) {
  const roleColor = ROLE_COLORS[currentUser.role];

  return (
    <div className="AppContainer">
      <header style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-primary)' }}>SEATSYNC</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: roleColor }}></div>
            <span className="Text__label" style={{ fontSize: '0.6rem' }}>{currentUser.role}</span>
          </div>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} style={{ padding: 10, borderRadius: 14, background: 'white', border: '1px solid #eee', cursor: 'pointer' }}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 100px' }}>
        {children}
      </main>

      <nav className="Navbar">
        <NavButton active={activeTab === 'home'} onClick={() => onTabChange('home')} icon={<Home size={22} />} label="Home" />
        <NavButton active={activeTab === 'book'} onClick={() => onTabChange('book')} icon={<Plus size={22} />} label="Reserve" />
        <NavButton active={activeTab === 'chat'} onClick={() => onTabChange('chat')} icon={<MessageCircle size={22} />} label="Sync" />
        <NavButton active={activeTab === 'profile'} onClick={() => onTabChange('profile')} icon={<UserIcon size={22} />} label="Portal" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button className={`Navbar__Item ${active ? 'Navbar__Item--active' : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function HomeSection({ bookings, venues }: any) {
  const confirmed = bookings.filter((b: any) => b.status === BookingStatus.CONFIRMED);
  return (
    <div>
      <h3 style={{ marginBottom: 20, fontWeight: 800 }}>Upcoming Sessions</h3>
      {confirmed.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>
          <Calendar size={48} style={{ margin: '0 auto 16px' }} />
          <p>No confirmed bookings found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {confirmed.map((b: any) => (
            <div key={b.id} style={{ background: 'white', padding: 20, borderRadius: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{b.purpose}</span>
                <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 900 }}>CONFIRMED</span>
              </div>
              <div style={{ display: 'flex', gap: 16, color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {venues.find((v: any) => v.id === b.venueId)?.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {b.startTime} - {b.endTime}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookSection({ venues, bookings, onSuccess, user, institution }: any) {
  const [venueId, setVenueId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('11:00');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const conflict = useMemo(() => {
    if (!venueId || !date || !start || !end) return null;
    return mockApi.checkConflict(venueId, date, start, end);
  }, [venueId, date, start, end, bookings]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (conflict || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await mockApi.createBooking({
        userId: user.id,
        venueId,
        institutionId: institution.id,
        date,
        startTime: start,
        endTime: end,
        purpose
      }, user.role);
      onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'white', padding: 24, borderRadius: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: 24, fontWeight: 900, fontSize: '1.4rem' }}>Reserve Workspace</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="InputGroup">
          <label className="Text__label">Select Venue</label>
          <select 
            className={`Input ${conflict ? 'Input--error' : ''}`}
            value={venueId} 
            onChange={e => setVenueId(e.target.value)}
            required
          >
            <option value="">Select a venue...</option>
            {venues.map((v: any) => <option key={v.id} value={v.id}>{v.name} ({v.capacity} pax)</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="InputGroup">
            <label className="Text__label">Date</label>
            <input className={`Input ${conflict ? 'Input--error' : ''}`} type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="InputGroup">
            <label className="Text__label">Purpose</label>
            <input className="Input" placeholder="Meeting, Lab..." value={purpose} onChange={e => setPurpose(e.target.value)} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="InputGroup">
            <label className="Text__label">Start Time</label>
            <input className={`Input ${conflict ? 'Input--error' : ''}`} type="time" value={start} onChange={e => setStart(e.target.value)} required />
          </div>
          <div className="InputGroup">
            <label className="Text__label">End Time</label>
            <input className={`Input ${conflict ? 'Input--error' : ''}`} type="time" value={end} onChange={e => setEnd(e.target.value)} required />
          </div>
        </div>

        {/* DOUBLE BOOKING WARNING MODULE */}
        <AnimatePresence>
          {conflict && (
            <motion.div 
              className="ConflictAlert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="ConflictAlert__Icon">
                <ShieldAlert size={24} />
              </div>
              <div className="ConflictAlert__Content">
                <h4>Double Booking Detected</h4>
                <p>The selected venue is already reserved for this specific time slot. Please adjust your schedule or choose a different venue.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          className="Button Button--primary" 
          disabled={conflict || isSubmitting || !venueId} 
          type="submit"
          style={{ marginTop: 8 }}
        >
          {isSubmitting ? 'Syncing Registry...' : conflict ? 'Resolve Conflicts' : 'Confirm Reservation'}
        </button>
      </form>
    </div>
  );
}
