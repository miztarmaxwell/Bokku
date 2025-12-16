import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Toast } from './components/Toast';
import { productsData } from './constants';
import type { Product, Notification, CartItem } from './types';
import { Modal } from './components/Modal';
import { NotificationsPanel } from './components/NotificationsPanel';
import { StoreLocatorPage } from './components/StoreLocatorPage';
import { ProductFilters } from './components/ProductFilters';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { TrackingPage } from './components/TrackingPage';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [toast, setToast] = useState<{ id: number, message: string } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState<'home' | 'store-locator' | 'cart' | 'checkout' | 'confirmation' | 'tracking'>('home');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Checkout State
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [orderId, setOrderId] = useState<string>('');
  const [orderEmail, setOrderEmail] = useState<string>('');

  // Cart State with LocalStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('bokku_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Ensure legacy cart items have quantity
        return parsedCart.map((item: any) => ({
            ...item,
            quantity: item.quantity || 1
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bokku_cart', JSON.stringify(cart));
  }, [cart]);

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

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prev => {
        const existingItem = prev.find(item => item.id === product.id);
        if (existingItem) {
            setToast({ id: Date.now(), message: `Increased quantity of ${product.name} in cart!` });
            return prev.map(item => 
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        }
        setToast({ id: Date.now(), message: `Added ${product.name} to cart!` });
        return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  }, []);

  const handleRemoveFromCart = useCallback((id: number) => {
      setCart(prev => prev.filter(item => item.id !== id));
      setToast({ id: Date.now(), message: 'Item removed from cart' });
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
    setCurrentPage('home');
    setIsNotificationsPanelOpen(false);
    // Optionally set filter to this product
    const product = products.find(p => p.id === productId);
    if(product) {
         setFilters(prev => ({...prev, searchTerm: product.name}));
         setToast({ id: Date.now(), message: `Filtered for ${product.name}` });
    }
  }, [products]);

  const handleNavigateToStoreLocator = useCallback(() => {
    setCurrentPage('store-locator');
  }, []);

  const handleNavigateToTracking = useCallback(() => {
    setCurrentPage('tracking');
  }, []);
  
  const handleGoHome = useCallback(() => {
    setCurrentPage('home');
    setFilters({ searchTerm: '', category: 'all', minPrice: '', maxPrice: '' }); 
  }, []);

  const handleCartClick = useCallback(() => {
      setCurrentPage('cart');
  }, []);

  const handleProceedToCheckout = useCallback(() => {
      setCurrentPage('checkout');
  }, []);

  const handlePaymentSuccess = useCallback((type: 'pickup' | 'delivery', email: string) => {
      const newOrderId = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit number
      setOrderId(newOrderId);
      setOrderType(type);
      setOrderEmail(email);
      setCart([]); // Clear cart
      setCurrentPage('confirmation');
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
                        onAddToCart={handleAddToCart}
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

  const renderContent = () => {
      switch(currentPage) {
          case 'cart':
              return <CartPage 
                        cart={cart} 
                        onRemove={handleRemoveFromCart} 
                        onUpdateQuantity={handleUpdateQuantity}
                        onProceed={handleProceedToCheckout} 
                        onContinueShopping={handleGoHome} 
                     />;
          case 'checkout':
              const total = cart.reduce((sum, item) => sum + (item.slashedPrice * item.quantity), 0);
              return <CheckoutPage 
                        total={total} 
                        onPaymentSuccess={handlePaymentSuccess} 
                        onBack={() => setCurrentPage('cart')} 
                     />;
          case 'confirmation':
              return <OrderConfirmationPage 
                        orderId={orderId} 
                        orderType={orderType} 
                        email={orderEmail}
                        onFindStore={handleNavigateToStoreLocator} 
                        onTrackOrder={handleNavigateToTracking}
                        onHome={handleGoHome} 
                     />;
          case 'tracking':
              return <TrackingPage orderId={orderId} onHome={handleGoHome} />;
          case 'store-locator':
              return <StoreLocatorPage />;
          case 'home':
          default:
              return <HomePage />;
      }
  };

  return (
    <div className="min-h-screen bg-[#E0F2FF] font-sans text-slate-800">
      <Header
        onToggleNotificationsPanel={handleToggleNotificationsPanel}
        unreadCount={unreadCount}
        onGoHome={handleGoHome}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={handleCartClick}
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

      {renderContent()}
      
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
    </div>
  );
};

export default App;