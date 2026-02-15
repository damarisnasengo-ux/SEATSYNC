
import React from 'react';
import { UserRole } from '../types';
import { ROLE_COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: UserRole;
  userName: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, role, userName, darkMode, onToggleDarkMode }) => {
  const roleColor = ROLE_COLORS[role];
  const isAdmin = role === UserRole.ADMIN;

  return (
    <div className={`${darkMode ? 'dark' : ''} h-screen max-w-md mx-auto transition-colors duration-500`}>
      <div className="flex flex-col h-full bg-[#FFFFD0] dark:bg-[#021019] overflow-hidden shadow-2xl relative border-x border-slate-100 dark:border-slate-900 transition-colors duration-500">
        {/* Header */}
        <header className="px-6 py-6 bg-white/40 dark:bg-[#021019]/80 backdrop-blur-xl shrink-0 border-b border-slate-100/50 dark:border-slate-900/50 z-50">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl text-white shadow-lg shadow-[#043C5C]/20 transition-all duration-300"
                style={{ backgroundColor: roleColor }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#043C5C] dark:text-slate-100 leading-none">SEATSYNC</h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-[0.2em] mt-1 uppercase">Campus Venue System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDarkMode();
                }}
                className="p-2 rounded-xl bg-white/50 dark:bg-slate-800 text-slate-400 hover:text-[#043C5C] dark:hover:text-white transition-all shadow-sm"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 16.243l.707.707M7.757 7.757l.707-.707M7 12a5 5 0 1110 0 5 5 0 01-10 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center transition-all duration-500"
              style={{ backgroundColor: `${roleColor}25` }}
            >
               <span className="text-lg font-bold" style={{ color: roleColor }}>{userName.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#043C5C] dark:text-slate-100">{userName}</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: roleColor }}></div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 pb-24 scroll-smooth relative">
          {children}
        </main>

        {/* Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/40 dark:bg-[#021019]/80 backdrop-blur-xl border-t border-slate-100/50 dark:border-slate-900 flex justify-around items-center px-2 py-3 safe-bottom z-50 transition-colors duration-500">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => onTabChange('home')}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
            label="Home"
            roleColor={roleColor}
          />
          
          <NavButton 
            active={activeTab === 'book'} 
            onClick={() => onTabChange('book')}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>}
            label="Book"
            roleColor={roleColor}
          />

          <NavButton 
            active={activeTab === 'my-bookings'} 
            onClick={() => onTabChange('my-bookings')}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            label="Mine"
            roleColor={roleColor}
          />

          {isAdmin ? (
            <NavButton 
              active={activeTab === 'approvals'} 
              onClick={() => onTabChange('approvals')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Review"
              roleColor={roleColor}
            />
          ) : (
            <NavButton 
              active={activeTab === 'schedule'} 
              onClick={() => onTabChange('schedule')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              label="Plan"
              roleColor={roleColor}
            />
          )}

          <NavButton 
            active={activeTab === 'profile'} 
            onClick={() => onTabChange('profile')}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            label="You"
            roleColor={roleColor}
          />
        </nav>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; roleColor: string }> = ({ active, onClick, icon, label, roleColor }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'scale-105' : 'text-slate-400 dark:text-slate-500'}`}
    style={{ color: active ? roleColor : '' }}
  >
    <div 
      className={`p-1.5 rounded-xl transition-all duration-500 ${active ? 'shadow-lg shadow-black/5 bg-white/40 dark:bg-white/10' : ''}`}
      style={active ? { borderColor: `${roleColor}40`, borderWidth: '1px' } : {}}
    >
      {icon}
    </div>
    <span className={`text-[9px] font-bold uppercase tracking-wider transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-40'}`}>
      {label}
    </span>
  </button>
);
