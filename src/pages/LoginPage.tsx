import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Eye, EyeOff } from 'lucide-react';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Clear error messages after 5 seconds
  useEffect(() => {
    if (formError || error) {
      // Start fading out after 4 seconds
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 4000);

      // Clear message after 5 seconds
      const clearTimer = setTimeout(() => {
        setFormError('');
        if (clearError) clearError(); // Clear the context error too
        setIsFadingOut(false);
      }, 5000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [formError, error, clearError]);

  // Reset error states when component unmounts or when navigating away
  useEffect(() => {
    return () => {
      if (clearError) clearError();
    };
  }, [clearError]);

  // Validate email as user types
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !EMAIL_REGEX.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Final validation before submit
    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="pb-20">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Sign in to your PopX account</h1>
        <p className="text-gray-600 mb-8">Please enter your credentials to access your account.</p>

        {(formError || error) && (
          <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            {formError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-purple-600 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter email address"
              className={`w-full px-4 py-3 rounded-lg border ${emailError ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 ${emailError ? 'focus:ring-red-500' : 'focus:ring-purple-500'}`}
              required
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!emailError}
            className={`w-full bg-purple-600 text-white py-3 rounded-lg transition-colors ${(isLoading || !!emailError) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-600 font-medium hover:text-purple-700">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;