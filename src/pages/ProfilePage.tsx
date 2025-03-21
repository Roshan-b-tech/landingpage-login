import React, { useRef, useState } from 'react';
import { useUser } from '../context/UserContext';
import { Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { userData, updateProfilePicture, isLoading, error, logout, isAuthenticated } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const navigate = useNavigate();

  const handleImageClick = () => {
    if (isAuthenticated) {
      fileInputRef.current?.click();
    } else {
      navigate('/login');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoadingImage(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          await updateProfilePicture(reader.result as string);
          setLoadingImage(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Error updating profile picture:', err);
        setLoadingImage(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Default profile image for non-authenticated users
  const defaultProfilePicture = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80";

  return (
    <div className="pb-20">
      <div className="p-6 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Account Settings</h1>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-red-600 flex items-center gap-1"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        )}
        {!isAuthenticated && (
          <button
            onClick={() => navigate('/login')}
            className="text-purple-600 font-medium"
          >
            Login
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
          {error}
        </div>
      )}

      <div className="p-6 flex gap-4">
        <div
          className={`relative cursor-pointer ${(loadingImage || isLoading) ? 'opacity-60' : ''}`}
          onClick={(loadingImage || isLoading) ? undefined : handleImageClick}
        >
          <img
            src={isAuthenticated ? userData.profilePicture : defaultProfilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
            <Camera size={16} className="text-white" />
          </div>
          {isAuthenticated && (
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              disabled={loadingImage || isLoading}
            />
          )}
          {(loadingImage || isLoading) && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-30">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold">{isAuthenticated ? (userData.fullName || 'No Name') : 'No Name'}</h2>
          <p className="text-gray-600">{isAuthenticated ? (userData.email || 'No Email') : 'No Email'}</p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <p className="text-gray-600">
          {isAuthenticated
            ? 'Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam Nonumy Eirmod Tempor Invidunt Ut Labore Et Dolore Magna Aliquyam Erat, Sed Diam'
            : 'Please log in to access your account settings and profile information.'}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;