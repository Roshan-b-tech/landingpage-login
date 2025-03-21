import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20">
      <div className="p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to PopX</h1>
        <p className="text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        
        <button
          onClick={() => navigate('/signup')}
          className="w-full bg-purple-600 text-white py-3 rounded-lg mb-4 hover:bg-purple-700 transition-colors"
        >
          Create Account
        </button>
        
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-purple-100 text-purple-600 py-3 rounded-lg hover:bg-purple-200 transition-colors"
        >
          Already Registered? Login
        </button>
      </div>
      <Navigation />
    </div>
  );
};

export default LandingPage;