import { useContext, useState } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { Link } from 'react-router-dom';

const ProfileCard = ({ profile }) => {
  const { setSelectedProfile, setSelectedLocation, indianCities } = useContext(ProfileContext);
  const [imageError, setImageError] = useState(false);
  
  const handleSummaryClick = () => {
    setSelectedProfile(profile);
    const city = indianCities.find(c => c.name === profile.address);
    if (city) {
      setSelectedLocation(city);
    }
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-102 border border-gray-200 flex flex-col h-full">
      <div className="h-64 overflow-hidden relative">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 font-medium">Image not available</span>
          </div>
        ) : (
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-full h-full object-contain"
            onError={handleImageError}
            loading="lazy"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24 opacity-70"></div>
        <h3 className="text-xl font-bold text-white absolute bottom-3 left-4 drop-shadow-lg">{profile.name}</h3>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-gray-700 mt-3 line-clamp-2">{profile.description}</p>
        <p className="text-gray-500 text-sm mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {profile.address}
        </p>
        <div className="mt-auto pt-6 flex justify-between">
          <Link
            to={`/profile/${profile.id}`}
            className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition font-medium"
          >
            View Details
          </Link>
          <button
            onClick={handleSummaryClick}
            className="px-5 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium border-2 border-black hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;