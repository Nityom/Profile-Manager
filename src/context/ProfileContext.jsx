import { createContext, useState, useEffect } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);


  const indianCities = [
    { name: "Mumbai", latitude: 19.0760, longitude: 72.8777 },
    { name: "Delhi", latitude: 28.7041, longitude: 77.1025 },
    { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
    { name: "Hyderabad", latitude: 17.3850, longitude: 78.4867 },
    { name: "Chennai", latitude: 13.0827, longitude: 80.2707 },
    { name: "Kolkata", latitude: 22.5726, longitude: 88.3639 },
    { name: "Pune", latitude: 18.5204, longitude: 73.8567 },
    { name: "Jaipur", latitude: 26.9124, longitude: 75.7873 },
    { name: "Jhanjharpur", latitude: 26.2647, longitude: 86.2799 }
  ];

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
  
        const storedProfiles = localStorage.getItem('profiles');
        
        if (storedProfiles) {
         
          setProfiles(JSON.parse(storedProfiles));
        } else {
 
          const dummyProfiles = [
            {
              id: 1,
              name: "Nityom Tikhe",
              photo: "https://avatars.githubusercontent.com/u/112824495?v=4",
              description: "Software Engineer with 3 years of experience",
              address: "Pune",
              contact: "nityomtikherr@gmail.com",
              interests: ["Coding", "Reading", "Traveling"]
            },
            {
              id: 2,
              name: "Atharva Joshi",
              photo: "https://avatars.githubusercontent.com/u/114106490?v=4",
              description: "UX Designer passionate about creating beautiful interfaces",
              address: "Delhi",
              contact: "atharva@gmail;.com",
              interests: ["Design", "Photography", "Yoga"]
            }
          ];
          setProfiles(dummyProfiles);
          
          // Store initial profiles in localStorage
          localStorage.setItem('profiles', JSON.stringify(dummyProfiles));
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfiles();
    
    // Attempt to restore selected profile and location from localStorage
    const storedSelectedProfile = localStorage.getItem('selectedProfile');
    if (storedSelectedProfile) {
      setSelectedProfile(JSON.parse(storedSelectedProfile));
    }
    
    const storedSelectedLocation = localStorage.getItem('selectedLocation');
    if (storedSelectedLocation) {
      setSelectedLocation(JSON.parse(storedSelectedLocation));
    }
  }, []);


  useEffect(() => {
    if (!loading) {
      localStorage.setItem('profiles', JSON.stringify(profiles));
    }
  }, [profiles, loading]);

  
  useEffect(() => {
    if (selectedProfile) {
      localStorage.setItem('selectedProfile', JSON.stringify(selectedProfile));
    } else {
      localStorage.removeItem('selectedProfile');
    }
  }, [selectedProfile]);

  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
    } else {
      localStorage.removeItem('selectedLocation');
    }
  }, [selectedLocation]);

  const addProfile = (profile) => {
    const newProfiles = [...profiles, { ...profile, id: profiles.length + 1 }];
    setProfiles(newProfiles);
  };

  const updateProfile = (id, updatedProfile) => {
    const newProfiles = profiles.map(profile => 
      profile.id === id ? { ...profile, ...updatedProfile } : profile
    );
    setProfiles(newProfiles);
  };

  const deleteProfile = (id) => {
    const newProfiles = profiles.filter(profile => profile.id !== id);
    setProfiles(newProfiles);
  };

  return (
    <ProfileContext.Provider value={{
      profiles,
      loading,
      error,
      selectedProfile,
      setSelectedProfile,
      selectedLocation,
      setSelectedLocation,
      indianCities,
      addProfile,
      updateProfile,
      deleteProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
};