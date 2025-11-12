import React from 'react';

interface Filters {
  searchTerm: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

interface ProductFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  categories: string[];
  onClose: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, setFilters, categories, onClose }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="p-4">
       <h3 id="modal-title" className="text-2xl font-bold text-gray-800 mb-6 text-center">Filter Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Search by Name */}
        <div className="sm:col-span-2">
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleInputChange}
            placeholder="e.g., Poundo Yam..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter by Category */}
        <div className="sm:col-span-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Price */}
        
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleInputChange}
            placeholder="₦0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleInputChange}
            placeholder="₦10,000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
       <div className="mt-8 grid grid-cols-2 gap-4">
         <button
            onClick={handleReset}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="w-full bg-[#0052FF] text-white py-2 rounded-lg font-semibold hover:bg-[#002D7A] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF]"
          >
            Apply Filters
          </button>
        </div>
    </div>
  );
};