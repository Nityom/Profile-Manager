import { useContext, useEffect, useState } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import ProfileCard from '../components/ProfileCard';
import MapView from '../components/MapView';
import SearchFilter from '../components/SearchFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const {
    profiles,
    loading,
    error,
    selectedProfile,
    setSelectedProfile,
    selectedLocation,
    setSelectedLocation,
    indianCities
  } = useContext(ProfileContext);

  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    let results = profiles;
    
  
    if (searchTerm) {
      results = results.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
  
    if (locationFilter) {
      results = results.filter(profile =>
        profile.address.toLowerCase() === locationFilter.toLowerCase()
      );
    }
    
    setFilteredProfiles(results);
  }, [profiles, searchTerm, locationFilter]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <SearchFilter 
            onSearch={setSearchTerm}
            onFilter={setLocationFilter}
            locations={indianCities.map(city => city.name)}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profiles List */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map(profile => (
                  <ProfileCard 
                    key={profile.id}
                    profile={profile}
                    onSelect={() => {
                      setSelectedProfile(profile);
                      const city = indianCities.find(c => c.name === profile.address);
                      if (city) setSelectedLocation(city);
                    }}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-10 text-gray-500">
                  No profiles match your search criteria
                </div>
              )}
            </div>
          </div>

          {/* Map and Summary Section */}
          <div className="lg:w-1/3 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <MapView />
            </div>
            
            {selectedProfile && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Selected Profile Summary</h3>
                <div className="flex items-start space-x-4">
                  <img 
                    src={selectedProfile.photo} 
                    alt={selectedProfile.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{selectedProfile.name}</h4>
                    <p className="text-sm text-gray-600">{selectedProfile.address}</p>
                    <p className="text-sm mt-1">{selectedProfile.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;