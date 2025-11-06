import React from 'react';

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const BellSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659M4 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
  </svg>
);


interface HeaderProps {
    notificationsEnabled: boolean;
    onToggleNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ notificationsEnabled, onToggleNotifications }) => {
  return (
    <header className="bg-[#0052FF] sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <span className="text-4xl font-extrabold text-white tracking-tighter">bokku!</span>
          </div>
          <button 
            onClick={onToggleNotifications}
            className="text-white hover:text-yellow-300 transition-colors"
            aria-label={notificationsEnabled ? 'Disable price notifications' : 'Enable price notifications'}
          >
            {notificationsEnabled ? <BellIcon /> : <BellSlashIcon />}
          </button>
        </div>
      </div>
    </header>
  );
};