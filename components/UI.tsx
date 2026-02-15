
import React from 'react';
import { TRANSITIONS, ROLE_COLORS } from '../constants';
import { UserRole } from '../types';

export const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
  role?: UserRole;
}> = ({ children, className = '', onClick, role }) => {
  const roleColor = role ? ROLE_COLORS[role] : 'transparent';
  return (
    <div 
      onClick={onClick}
      // Fixed: Merged duplicate style attributes into a single object to resolve JSX error
      style={{ 
        '--role-color': roleColor,
        ...(role ? { borderLeftColor: roleColor } : {})
      } as React.CSSProperties}
      className={`bg-white dark:bg-slate-900/50 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--role-color)]/5 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${role ? 'border-l-4' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; 
  className?: string; 
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  role?: UserRole;
}> = ({ children, variant = 'primary', className = '', onClick, disabled, type = 'button', role }) => {
  const roleColor = role ? ROLE_COLORS[role] : '#043C5C';
  
  const variants = {
    primary: `bg-[#043C5C] text-white hover:bg-[#064d75] dark:bg-[#064d75] dark:hover:bg-[#043C5C]`,
    secondary: `bg-[#E1D4B7] text-[#043C5C] hover:bg-[#d9c8a1]`,
    outline: `border-2 border-[#043C5C] text-[#043C5C] hover:bg-[#043C5C] hover:text-white dark:border-slate-700 dark:text-slate-300`,
    ghost: `text-[#64748B] hover:bg-slate-100 dark:hover:bg-slate-800`,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold text-sm relative overflow-hidden group ${variants[variant]} ${TRANSITIONS.standard} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {role && (
        <span 
          className="absolute inset-0 bg-[var(--role-color)] opacity-0 group-hover:opacity-10 transition-opacity"
          style={{ '--role-color': roleColor } as React.CSSProperties}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export const Input: React.FC<{ 
  label?: string; 
  placeholder?: string; 
  type?: string; 
  value: string; 
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}> = ({ label, placeholder, type = 'text', value, onChange, icon }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 ${icon ? 'pl-10' : 'px-4'} text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#043C5C]/20 focus:border-[#043C5C] dark:focus:border-slate-600 ${TRANSITIONS.fast}`}
      />
    </div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; type?: 'success' | 'warning' | 'danger' | 'info' | 'role'; role?: UserRole }> = ({ children, type = 'info', role }) => {
  const roleColor = role ? ROLE_COLORS[role] : '';
  
  const colors = {
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    warning: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    danger: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    info: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20',
    role: '',
  };

  const style = type === 'role' ? { 
    backgroundColor: `${roleColor}15`, 
    color: roleColor, 
    borderColor: `${roleColor}30` 
  } : {};

  return (
    <span 
      style={style}
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${type !== 'role' ? colors[type] : ''}`}
    >
      {children}
    </span>
  );
};

export const Avatar: React.FC<{ src?: string; size?: 'sm' | 'md' | 'lg'; role?: UserRole }> = ({ src, size = 'md', role }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };
  const roleColor = role ? ROLE_COLORS[role] : '#ffffff';
  
  return (
    <div 
      className={`${sizes[size]} rounded-2xl overflow-hidden border-2 shadow-sm bg-slate-200 dark:bg-slate-800`}
      style={{ borderColor: roleColor }}
    >
      <img src={src || `https://ui-avatars.com/api/?name=User&background=random`} alt="User avatar" className="w-full h-full object-cover" />
    </div>
  );
};
