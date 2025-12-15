import React from 'react';
import type { Product } from '../types';

interface CartPageProps {
  cart: Product[];
  onRemove: (index: number) => void;
  onProceed: () => void;
  onContinueShopping: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cart, onRemove, onProceed, onContinueShopping }) => {
  const total = cart.reduce((sum, item) => sum + item.slashedPrice, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-3xl font-bold text-[#0052FF] mb-8">Your Cart</h2>
      
      {cart.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
          <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
          <button 
            onClick={onContinueShopping}
            className="bg-[#0052FF] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#002D7A] transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            <ul className="space-y-4">
              {cart.map((item, index) => (
                <li key={`${item.id}-${index}`} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-contain rounded" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-red-500 font-bold">₦{item.slashedPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-80">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
              <div className="flex justify-between mb-4 text-lg">
                <span>Total</span>
                <span className="font-bold text-[#0052FF]">₦{total.toLocaleString()}</span>
              </div>
              <button 
                onClick={onProceed}
                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors mb-3"
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={onContinueShopping}
                className="w-full text-[#0052FF] py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};