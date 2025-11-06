import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Toast } from './components/Toast';
import { productsData } from './constants';
import type { Product, Notification } from './types';
import { Modal } from './components/Modal';
import { NotificationsPanel } from './components/NotificationsPanel';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [toast, setToast] = useState<{ id: number, message: string } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleToggleNotifications = useCallback(() => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);
    const message = newStatus
      ? 'Price slash notifications enabled!'
      : 'Price slash notifications disabled.';
    setToast({ id: Date.now(), message });
  }, [notificationsEnabled]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!notificationsEnabled) return;

      setProducts(prevProducts => {
        const productsCopy = [...prevProducts];
        const productIndex = Math.floor(Math.random() * productsCopy.length);
        const productToUpdate = productsCopy[productIndex];

        const newSlashedPrice = Math.floor(productToUpdate.slashedPrice * 0.95);

        if (newSlashedPrice === productToUpdate.slashedPrice) {
          return prevProducts;
        }

        productsCopy[productIndex] = {
          ...productToUpdate,
          originalPrice: productToUpdate.slashedPrice,
          slashedPrice: newSlashedPrice,
        };
        
        const message = `Price drop for ${productToUpdate.name}! Now ₦${newSlashedPrice.toLocaleString()}`;

        setToast({ id: Date.now(), message });
        setNotifications(prev => [{ id: Date.now(), message, timestamp: new Date() }, ...prev.slice(0, 19)]);
        
        if (!isNotificationsPanelOpen) {
          setUnreadCount(prev => prev + 1);
        }

        return productsCopy;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [notificationsEnabled, isNotificationsPanelOpen]);

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleToggleNotificationsPanel = useCallback(() => {
    setIsNotificationsPanelOpen(prev => {
      if (!prev) { // If panel is about to open
        setUnreadCount(0);
      }
      return !prev;
    });
  }, []);

  const handleClearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <div className="min-h-screen bg-[#E0F2FF] font-sans text-slate-800">
      <Header
        onToggleNotificationsPanel={handleToggleNotificationsPanel}
        unreadCount={unreadCount}
      />
       <div className="relative">
        <NotificationsPanel
          isOpen={isNotificationsPanelOpen}
          notifications={notifications}
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={handleToggleNotifications}
          onClear={handleClearNotifications}
          onClose={() => setIsNotificationsPanelOpen(false)}
        />
      </div>
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
           <div className="inline-block bg-gradient-to-r from-[#FFD700] to-[#0052FF] rounded-lg p-1 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white px-6 py-2">
                    Exclusively available at bokku!
                </h2>
            </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#002D7A] mb-4">
            Real-Time Price Slashes!
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Our prices are dropping live! Click the bell icon in the header to see recent deals and manage notifications.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </section>
      </main>
      <footer className="text-center py-6 mt-12">
        <p className="text-slate-600">&copy; 2024 Bokku Price Notifier. All rights reserved.</p>
      </footer>
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}
      {quickViewProduct && (
        <Modal isOpen={!!quickViewProduct} onClose={handleCloseModal}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
              <img 
                src={quickViewProduct.imageUrl} 
                alt={quickViewProduct.name} 
                className="w-full h-auto max-h-96 object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col h-full">
              <h2 id="modal-title" className="text-3xl font-bold text-[#002D7A] mb-4">
                {quickViewProduct.name}
              </h2>
              <div className="mb-6 flex-grow">
                <ul className="list-disc list-inside text-slate-600 space-y-2 text-lg">
                  {quickViewProduct.description.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>
              <div className="flex items-center space-x-4 mt-auto">
                <p className="text-xl text-slate-500 line-through">
                    ₦{quickViewProduct.originalPrice.toLocaleString()}
                </p>
                <p className="bg-red-500 text-white font-extrabold text-3xl px-5 py-2 rounded-lg">
                    ₦{quickViewProduct.slashedPrice.toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Price subject to change. Grab it while it's hot!
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default App;