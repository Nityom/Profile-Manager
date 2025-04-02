import { createContext, useState, useEffect } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Indian cities with coordinates
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
        // Check if profiles exist in localStorage
        const storedProfiles = localStorage.getItem('profiles');
        
        if (storedProfiles) {
          // Use stored profiles if they exist
          setProfiles(JSON.parse(storedProfiles));
        } else {
          // Otherwise use default dummy profiles
          const dummyProfiles = [
            {
              id: 1,
              name: "Rahul Sharma",
              photo: "https://randomuser.me/api/portraits/men/1.jpg",
              description: "Software Engineer with 5 years of experience",
              address: "Mumbai",
              contact: "rahul.sharma@example.com",
              interests: ["Coding", "Reading", "Traveling"]
            },
            {
              id: 2,
              name: "Priya Patel",
              photo: "https://randomuser.me/api/portraits/women/2.jpg",
              description: "UX Designer passionate about creating beautiful interfaces",
              address: "Delhi",
              contact: "priya.patel@example.com",
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

  // Update localStorage whenever profiles change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('profiles', JSON.stringify(profiles));
    }
  }, [profiles, loading]);

  // Update localStorage when selectedProfile changes
  useEffect(() => {
    if (selectedProfile) {
      localStorage.setItem('selectedProfile', JSON.stringify(selectedProfile));
    } else {
      localStorage.removeItem('selectedProfile');
    }
  }, [selectedProfile]);

  // Update localStorage when selectedLocation changes
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