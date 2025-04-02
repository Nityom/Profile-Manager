import { useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext';
import LoadingSpinner from './LoadingSpinner';

const ProfileDetails = () => {
  const { id } = useParams();
  const { profiles, loading, error, selectedProfile, setSelectedProfile } = useContext(ProfileContext);

  useEffect(() => {
    if (profiles.length > 0) {
      const profile = profiles.find(p => p.id === parseInt(id));
      setSelectedProfile(profile || null);
    }
  }, [id, profiles, setSelectedProfile]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!selectedProfile) return <div className="text-gray-500">Profile not found</div>;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={selectedProfile.photo} 
            alt={selectedProfile.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:w-2/3">
          <h1 className="text-2xl font-bold">{selectedProfile.name}</h1>
          <p className="text-gray-600 mt-2">{selectedProfile.description}</p>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <p className="text-gray-600 mt-2">{selectedProfile.contact}</p>
            <p className="text-gray-600">{selectedProfile.address}</p>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Interests</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProfile.interests.map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm border border-gray-200">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <Link 
              to="/" 
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-sm"
            >
              Back to Profiles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;