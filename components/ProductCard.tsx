import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { name, imageUrl, originalPrice, slashedPrice, description } = product;

  return (
    <div className="bg-[#D1F7F7] rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="relative">
        <img className="h-64 w-full object-contain bg-white" src={imageUrl} alt={name} />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-yellow-700 mb-2">{name}</h3>
        <div className="mb-4 flex-grow">
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            {description.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
        <div className="mt-auto pt-4 space-y-4">
          <div className="flex justify-between items-center">
             <div className="text-sm text-slate-500 line-through">
                ₦{originalPrice.toLocaleString()}
            </div>
            <div className="bg-red-500 text-white font-extrabold text-xl px-4 py-1 rounded-md">
                ₦{slashedPrice.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            aria-label={`Add ${name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};