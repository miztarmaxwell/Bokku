import React from 'react';

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface HeaderProps {
    onToggleNotificationsPanel: () => void;
    unreadCount: number;
    onGoHome: () => void;
    cartCount: number;
    onCartClick: () => void;
    onStoreLocatorClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleNotificationsPanel, 
  unreadCount, 
  onGoHome, 
  cartCount, 
  onCartClick,
  onStoreLocatorClick 
}) => {
  return (
    <header className="bg-[#0052FF] sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <button onClick={onGoHome} className="flex items-center space-x-2" aria-label="Go to homepage">
            <span className="text-4xl font-extrabold text-yellow-300 tracking-tighter">bokku!</span>
          </button>
          <div className="flex items-center space-x-6">
            <button 
              onClick={onStoreLocatorClick} 
              className="text-white hover:text-yellow-300 transition-colors"
              aria-label="Store Locator"
            >
                <MapPinIcon />
            </button>
            <div className="relative">
                <button 
                  onClick={onCartClick} 
                  className="text-white hover:text-yellow-300 transition-colors"
                  aria-label="View Cart"
                >
                    <CartIcon />
                </button>
                 {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-[#0052FF] pointer-events-none">
                        {cartCount}
                    </span>
                )}
            </div>
            <div className="relative">
                <button 
                onClick={onToggleNotificationsPanel}
                className="text-white hover:text-yellow-300 transition-colors"
                aria-label="Toggle notifications panel"
                >
                <BellIcon />
                </button>
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white pointer-events-none">
                        {unreadCount}
                    </span>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};