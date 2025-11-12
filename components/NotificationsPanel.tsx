import React, { useState } from 'react';
import type { Notification, Product } from '../types';
import { ToggleSwitch } from './ToggleSwitch';

interface NotificationsPanelProps {
  isOpen: boolean;
  notifications: Notification[];
  products: Product[];
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onClear: () => void;
  onClose: () => void;
  onNotificationClick: (productId: number) => void;
}

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);


function formatTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    if (seconds < 10) return "just now";
    return Math.floor(seconds) + "s ago";
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  notifications,
  products,
  notificationsEnabled,
  onToggleNotifications,
  onClear,
  onNotificationClick,
}) => {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(notification => {
    const searchTerm = filter.toLowerCase();
    
    const messageMatch = notification.message.toLowerCase().includes(searchTerm);
    
    const product = products.find(p => p.id === notification.productId);
    const productNameMatch = product ? product.name.toLowerCase().includes(searchTerm) : false;
    
    return messageMatch || productNameMatch;
  });

  return (
    <div className="absolute top-full right-4 mt-2 w-80 max-w-sm bg-white rounded-lg shadow-2xl border border-gray-200 z-40 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Notifications</h3>
        <ToggleSwitch 
            enabled={notificationsEnabled}
            onChange={onToggleNotifications}
            label=""
        />
      </div>
       <div className="p-2 border-b border-gray-200">
        <input
          type="text"
          placeholder="Filter notifications..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter notifications"
        />
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center p-8">No new notifications.</p>
        ) : filteredNotifications.length === 0 ? (
            <p className="text-gray-500 text-center p-8">No notifications match your filter.</p>
        ) : (
          <ul>
            {filteredNotifications.map(notification => (
              <li 
                key={notification.id} 
                className="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onNotificationClick(notification.productId)}
                >
                <div className="flex items-start">
                    <BellIcon />
                    <div className="flex-1">
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.timestamp)}</p>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-2 bg-gray-50 border-t border-gray-200 mt-auto">
            <button
                onClick={onClear}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-semibold py-1 rounded transition-colors"
            >
                Clear All
            </button>
        </div>
      )}
    </div>
  );
};