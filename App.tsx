import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Toast } from './components/Toast';
import { productsData } from './constants';
import type { Product, Notification } from './types';
import { Modal } from './components/Modal';
import { NotificationsPanel } from './components/NotificationsPanel';
import { StoreLocatorPage } from './components/StoreLocatorPage';
import { ProductFilters } from './components/ProductFilters';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [toast, setToast] = useState<{ id: number, message: string } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState<'home' | 'store-locator'>('home');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
  });

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
        setNotifications(prev => [{ id: Date.now(), message, timestamp: new Date(), productId: productToUpdate.id }, ...prev.slice(0, 19)]);
        
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

  const handleNotificationClick = useCallback((productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
      setIsNotificationsPanelOpen(false);
    }
  }, [products]);

  const handleNavigateToStoreLocator = useCallback(() => {
    setCurrentPage('store-locator');
  }, []);
  
  const handleGoHome = useCallback(() => {
    setCurrentPage('home');
  }, []);

  const HomePage = () => {
    const categories = useMemo(() => ['all', ...new Set(productsData.map(p => p.category))], []);

    const filteredProducts = useMemo(() => {
      return products.filter(product => {
        const { searchTerm, category, minPrice, maxPrice } = filters;
        const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = category === 'all' || product.category === category;
        const minPriceMatch = minPrice === '' || product.slashedPrice >= parseFloat(minPrice);
        const maxPriceMatch = maxPrice === '' || product.slashedPrice <= parseFloat(maxPrice);
        return searchMatch && categoryMatch && minPriceMatch && maxPriceMatch;
      });
    }, [products, filters]);

    return (
    <>
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
           <div className="inline-block bg-gradient-to-r from-[#FFD700] to-[#0052FF] rounded-lg p-1 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white px-6 py-2">
                    Exclusively available at bokku!
                </h2>
            </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-600 mb-4">
            Real-Time Price Slashes!
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Our prices are dropping live! Use the filters below to find the best deals.
          </p>
        </section>
        
        <div className="mb-8 text-center">
            <button
                onClick={() => setIsFilterModalOpen(true)}
                className="bg-[#0052FF] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#002D7A] transition-colors duration-300 text-lg flex items-center justify-center mx-auto"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter Products
            </button>
        </div>


        <section>
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={handleQuickView}
                    />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-slate-500">No products match your current filters.</p>
                </div>
            )}
        </section>
      </main>
      <footer className="text-center py-6 mt-12">
        <p className="text-slate-600">&copy; 2024 Bokku Price Notifier. All rights reserved.</p>
      </footer>
    </>
  )};

  const categories = useMemo(() => ['all', ...new Set(productsData.map(p => p.category))], []);

  return (
    <div className="min-h-screen bg-[#E0F2FF] font-sans text-slate-800">
      <Header
        onToggleNotificationsPanel={handleToggleNotificationsPanel}
        unreadCount={unreadCount}
        onGoHome={handleGoHome}
      />
       <div className="relative">
        <NotificationsPanel
          isOpen={isNotificationsPanelOpen}
          notifications={notifications}
          products={products}
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={handleToggleNotifications}
          onClear={handleClearNotifications}
          onClose={() => setIsNotificationsPanelOpen(false)}
          onNotificationClick={handleNotificationClick}
        />
      </div>

      {currentPage === 'home' ? <HomePage /> : <StoreLocatorPage />}
      
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}
      {isFilterModalOpen && (
          <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
              <ProductFilters
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                onClose={() => setIsFilterModalOpen(false)}
              />
          </Modal>
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
              <h2 id="modal-title" className="text-3xl font-bold text-yellow-600 mb-4">
                {quickViewProduct.name}
              </h2>
              <div className="mb-6 flex-grow">
                <ul className="list-disc list-inside text-slate-600 space-y-2 text-lg">
                  {quickViewProduct.description.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-4">
                    <p className="text-xl text-slate-500 line-through">
                        ₦{quickViewProduct.originalPrice.toLocaleString()}
                    </p>
                    <p className="bg-red-500 text-white font-extrabold text-3xl px-5 py-2 rounded-lg">
                        ₦{quickViewProduct.slashedPrice.toLocaleString()}
                    </p>
                </div>
                 <button 
                    onClick={() => {
                        handleNavigateToStoreLocator();
                        handleCloseModal();
                    }}
                    className="bg-[#0052FF] text-white py-3 px-5 rounded-lg font-semibold hover:bg-[#002D7A] transition-colors duration-300 text-lg"
                  >
                    Find a Store
                  </button>
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