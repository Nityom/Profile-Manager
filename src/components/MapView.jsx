import { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';

const MapView = () => {
  const { selectedLocation, indianCities, setSelectedLocation } = useContext(ProfileContext);

  const handleLocationChange = (e) => {
    const city = indianCities.find(c => c.name === e.target.value);
    if (city) {
      setSelectedLocation(city);
    }
  };

  const mapLink = selectedLocation
    ? `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${selectedLocation.longitude}!3d${selectedLocation.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000`
    : '';

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Select Location
        </label>
        <select
          id="location"
          onChange={handleLocationChange}
          value={selectedLocation?.name || ''}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a city</option>
          {indianCities.map(city => (
            <option key={city.name} value={city.name}>{city.name}</option>
          ))}
        </select>
      </div>
      
      <div className="relative h-96 w-full rounded-lg overflow-hidden">
        <iframe
          title="Profile Location"
          src={mapLink}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default MapView;