import { useState } from 'react';

const SearchFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleLocationChange = (e) => {
    setFilterLocation(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <div className="rounded-lg border border-gray-200 p-6 mb-6 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-2">
            Search by Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg 
                className="w-4 h-4 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            />
          </div>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Filter by Location
          </label>
          <div className="relative">
            <select
              id="location"
              value={filterLocation}
              onChange={handleLocationChange}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:ring-black focus:border-black"
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Pune">Pune</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Jhanjharpur">Jhanjharpur</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;