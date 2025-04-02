import { useContext, useState, useEffect } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import Toast from './Toast';
import useProfiles from '../hooks/useProfiles';

const AdminPanel = () => {
  const { profiles, addProfile, updateProfile, deleteProfile } = useContext(ProfileContext);
  const { handleImageUpload } = useProfiles();
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    photo: '',
    description: '',
    address: '',
    contact: '',
    interests: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [uploadType, setUploadType] = useState('url');
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ 
    show: false, 
    message: '', 
    type: 'info' 
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageInputChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, photoPreview: preview }));
    } catch (error) {
      showToast(`Error previewing image: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let photoUrl = formData.photo;
      
      if (uploadType === 'file' && imageFile) {
        photoUrl = await handleImageUpload(imageFile);
      }
      
      const profileData = {
        ...formData,
        photo: photoUrl,
        interests: formData.interests.split(',').map(item => item.trim())
      };

      delete profileData.photoPreview;

      if (isEditing) {
        updateProfile(parseInt(formData.id), profileData);
        showToast(`Profile updated successfully`, 'success');
      } else {
        addProfile(profileData);
        showToast(`New profile added successfully`, 'success');
      }

      resetForm();
    } catch (error) {
      showToast(error.message || 'Failed to save profile', 'error');
    }
  };

  const handleEdit = (profile) => {
    setFormData({
      id: profile.id,
      name: profile.name,
      photo: profile.photo,
      description: profile.description,
      address: profile.address,
      contact: profile.contact,
      interests: profile.interests.join(', ')
    });
    
    setUploadType(profile.photo.startsWith('data:image') ? 'file' : 'url');
    setIsEditing(true);
  };

  const handleDelete = (profile) => {
    if (window.confirm(`Delete ${profile.name}?`)) {
      deleteProfile(profile.id);
      showToast(`Profile deleted`, 'delete');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      photo: '',
      description: '',
      address: '',
      contact: '',
      interests: ''
    });
    setImageFile(null);
    setUploadType('url');
    setIsEditing(false);
  };

  const textareaRows = windowWidth > 768 ? 3 : 2;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))} 
        />
      )}
      
      <div className="rounded-lg border border-gray-300 p-4 md:p-6 max-w-4xl mx-auto bg-white">
        <h2 className="text-lg md:text-xl font-medium mb-4">
          {isEditing ? 'Edit Profile' : 'Add New Profile'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {isEditing && (
              <>
                <label className="md:col-span-1 text-sm md:text-base font-medium self-center">
                  ID
                </label>
                <div className="md:col-span-3">
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    readOnly
                    className="w-full p-2 text-sm md:text-base border border-gray-300 rounded bg-gray-100"
                  />
                </div>
              </>
            )}

            <label className="md:col-span-1 text-sm md:text-base font-medium self-center">
              Name
            </label>
            <div className="md:col-span-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 text-sm md:text-base border border-gray-300 rounded"
              />
            </div>

            <label className="md:col-span-1 text-sm md:text-base font-medium self-center">
              Photo
            </label>
            <div className="md:col-span-3 space-y-2">
              <div className="flex space-x-2">
                <button 
                  type="button"
                  onClick={() => setUploadType('url')}
                  className={`px-3 py-1 text-xs md:text-sm rounded border ${
                    uploadType === 'url' ? 'bg-gray-800 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  {windowWidth > 768 ? 'Use URL' : 'URL'}
                </button>
                <button 
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={`px-3 py-1 text-xs md:text-sm rounded border ${
                    uploadType === 'file' ? 'bg-gray-800 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  {windowWidth > 768 ? 'Upload File' : 'Upload'}
                </button>
              </div>

              {uploadType === 'url' ? (
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                  required={uploadType === 'url'}
                  className="w-full p-2 text-sm md:text-base border border-gray-300 rounded mt-2"
                />
              ) : (
                <div className="space-y-2 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageInputChange}
                    required={uploadType === 'file' && !formData.photo?.startsWith('data:image')}
                    className="w-full p-1 md:p-2 text-xs md:text-sm border border-gray-300 rounded"
                  />
                  {(formData.photoPreview || formData.photo?.startsWith('data:image')) && (
                    <div className="mt-2 flex items-center space-x-4">
                      <p className="text-xs md:text-sm text-gray-600">Preview:</p>
                      <img 
                        src={formData.photoPreview || formData.photo} 
                        alt="Preview" 
                        className="h-16 w-16 md:h-20 md:w-20 object-cover rounded border border-gray-300" 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <label className="md:col-span-1 text-sm md:text-base font-medium self-center">
              Description
            </label>
            <div className="md:col-span-3">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={textareaRows}
                className="w-full p-2 text-sm md:text-base border border-gray-300 rounded"
              ></textarea>
            </div>

            <label className="md:col-span-1 text-sm md:text-base font-medium self-center">
              Address
            </label>
            <div className="md:col-span-3">
              <select
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full p-2 text-sm md:text-base border border-gray-300 rounded"
              >
                <option value="">Select city</option>
                {indianCities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            <label className="md:col-span-1 text-sm md:text-base font-medium self-center">
              Email
            </label>
            <div className="md:col-span-3">
              <input
                type="email"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
                className="w-full p-2 text-sm md:text-base border border-gray-300 rounded"
              />
            </div>

            <label className="md:col-span-1 text-sm md:text-base font-medium self-center">
              Interests
            </label>
            <div className="md:col-span-3">
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="Separate with commas"
                required
                className="w-full p-2 text-sm md:text-base border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 text-sm md:text-base bg-gray-800 text-white rounded hover:bg-gray-700 flex-1"
            >
              {isEditing ? 'Update Profile' : 'Add Profile'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm md:text-base border border-gray-300 rounded hover:bg-gray-50 flex-1"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-gray-300 p-4 md:p-6 max-w-6xl mx-auto bg-white">
        <h2 className="text-lg md:text-xl font-medium mb-4">Manage Profiles</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
                  Profile
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {profiles.length > 0 ? (
                profiles.map(profile => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover border border-gray-300" 
                            src={profile.photo} 
                            alt={profile.name} 
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40';
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm md:text-base font-medium">{profile.name}</div>
                          <div className="text-xs md:text-sm text-gray-600 line-clamp-1">{profile.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm md:text-base">
                      {profile.address}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm md:text-base">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(profile)}
                          className="text-black"
                        >
                          Edit
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                          onClick={() => handleDelete(profile)}
                          className="text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-gray-600">
                    No profiles found. Add your first profile above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;