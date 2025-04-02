import { useContext, useState } from 'react';
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
  const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageInputChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    
    if (file) {
      try {
        const preview = URL.createObjectURL(file);
        setFormData({
          ...formData,
          photoPreview: preview
        });
      } catch (error) {
        setToast({
          show: true,
          message: `Error previewing image: ${error.message}`,
          type: 'error'
        });
      }
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
        setToast({
          show: true,
          message: `Profile for ${formData.name} updated successfully!`,
          type: 'success'
        });
      } else {
        addProfile(profileData);
        setToast({
          show: true,
          message: `New profile for ${formData.name} added successfully!`,
          type: 'success'
        });
      }

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
    } catch (error) {
      setToast({
        show: true,
        message: `Error: ${error.message || 'Something went wrong'}`,
        type: 'error'
      });
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
    
    if (profile.photo.startsWith('data:image')) {
      setUploadType('file');
    } else {
      setUploadType('url');
    }
    
    setIsEditing(true);
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div className="space-y-6 p-6">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      <div className="rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4">{isEditing ? 'Edit Profile' : 'Add New Profile'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditing && (
            <div>
              <label className="block text-sm font-medium mb-1">ID</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Photo</label>
            <div className="flex space-x-2 mb-3">
              <button 
                type="button"
                onClick={() => setUploadType('url')}
                className={`px-3 py-1 rounded text-sm border ${uploadType === 'url' ? 'bg-black text-white' : 'bg-white border-gray-300'}`}
              >
                Use URL
              </button>
              <button 
                type="button"
                onClick={() => setUploadType('file')}
                className={`px-3 py-1 rounded text-sm border ${uploadType === 'file' ? 'bg-black text-white' : 'bg-white border-gray-300'}`}
              >
                Upload File
              </button>
            </div>

            {uploadType === 'url' ? (
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                required={uploadType === 'url'}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageInputChange}
                  required={uploadType === 'file' && !formData.photo?.startsWith('data:image')}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {(formData.photoPreview || formData.photo?.startsWith('data:image')) && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={formData.photoPreview || formData.photo} 
                      alt="Preview" 
                      className="h-20 w-20 object-cover rounded-md border border-gray-300" 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address (City)</label>
            <select
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a city</option>
              {indianCities.map(city => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              type="email"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Interests (comma separated)</label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm"
            >
              {isEditing ? 'Update Profile' : 'Add Profile'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
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
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4">Manage Profiles</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profiles.map(profile => (
                <tr key={profile.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={profile.photo} alt={profile.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{profile.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{profile.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="text-gray-600 hover:text-gray-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        deleteProfile(profile.id);
                        setToast({
                          show: true,
                          message: `Profile for ${profile.name} deleted successfully!`,
                          type: 'delete'
                        });
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;