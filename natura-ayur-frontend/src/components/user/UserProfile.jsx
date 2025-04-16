import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../redux/actions/authActions';
import { 
  selectUser, 
  selectAuthLoading, 
  selectAuthError 
} from '../../redux/selectors/authSelectors';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import AddressForm from './AddressForm';

/**
 * User profile management component
 */
const UserProfile = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  // State for user profile data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
    avatar: null
  });
  
  // State for image preview
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  
  // Populate form with user data when available
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        contactNo: user.contactNo || '',
        email: user.email || '',
        avatar: null
      });
      
      // Set avatar preview if available
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);
  
  // Clear success message after a timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'avatar' && files && files[0]) {
      // Handle file input
      setProfileData(prev => ({
        ...prev,
        avatar: files[0]
      }));
      
      // Create preview URL
      const previewURL = URL.createObjectURL(files[0]);
      setAvatarPreview(previewURL);
    } else {
      // Handle text input
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear field error
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!profileData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!profileData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (profileData.contactNo && !/^\d{10}$/.test(profileData.contactNo)) {
      errors.contactNo = 'Contact number must be 10 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create form data for file upload
    const formData = new FormData();
    
    // Add form fields to FormData
    Object.keys(profileData).forEach(key => {
      if (key !== 'email' && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    });
    
    // Update profile
    const resultAction = await dispatch(updateUserProfile(formData));
    
    // Show success message if successful
    if (updateUserProfile.fulfilled.match(resultAction)) {
      setSuccessMessage('Profile updated successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview !== user?.avatar) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview, user?.avatar]);
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <Card title="Personal Information">
        <form onSubmit={handleSubmit}>
          {/* Avatar upload */}
          <div className="flex items-center mb-6">
            <div className="mr-6">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg 
                    className="h-12 w-12 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg 
                  className="mr-2 -ml-1 h-5 w-5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" 
                  />
                </svg>
                Upload Photo
                <input
                  type="file"
                  name="avatar"
                  onChange={handleChange}
                  accept="image/png, image/jpeg, image/jpg"
                  className="sr-only"
                />
              </label>
              
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG or JPEG (max. 2MB)
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="firstName"
              label="First Name"
              value={profileData.firstName}
              onChange={handleChange}
              error={formErrors.firstName}
              required
            />
            
            <Input
              name="lastName"
              label="Last Name"
              value={profileData.lastName}
              onChange={handleChange}
              error={formErrors.lastName}
              required
            />
            
            <Input
              name="contactNo"
              label="Contact Number"
              value={profileData.contactNo}
              onChange={handleChange}
              error={formErrors.contactNo}
              placeholder="1234567890"
            />
            
            <Input
              name="email"
              label="Email Address"
              value={profileData.email}
              disabled
              className="bg-gray-100"
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Update Profile
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Address information */}
      <div className="mt-8">
        <AddressForm />
      </div>
    </div>
  );
};

export default UserProfile;