import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Eye, EyeOff } from 'lucide-react';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    companyName: '',
    isAgency: false
  });
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        return value && !EMAIL_REGEX.test(value)
          ? 'Please enter a valid email address'
          : '';
      case 'fullName':
        return value.length < 2 && value.length > 0
          ? 'Name must be at least 2 characters'
          : '';
      case 'password':
        return value.length < 6 && value.length > 0
          ? 'Password must be at least 6 characters'
          : '';
      case 'phone':
        return value && !/^\d{10}$/.test(value.replace(/\D/g, ''))
          ? 'Please enter a valid 10-digit phone number'
          : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prevData => ({
      ...prevData,
      [name]: newValue
    }));

    // Only validate text fields
    if (type !== 'checkbox' && (name === 'email' || name === 'fullName' || name === 'password' || name === 'phone')) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setFormError('Full name, email and password are required');
      return;
    }

    // Email validation
    if (!EMAIL_REGEX.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    // Check for any field errors
    const hasErrors = Object.values(fieldErrors).some(error => error !== '');
    if (hasErrors) {
      setFormError('Please fix the errors in the form');
      return;
    }

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      navigate('/profile');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="pb-20">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Create your PopX account</h1>
        <p className="text-gray-600 mb-8">Please complete the registration to get started.</p>

        {(formError || error) && (
          <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            {formError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-purple-600 mb-1">
              Full Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.fullName ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 ${fieldErrors.fullName ? 'focus:ring-red-500' : 'focus:ring-purple-500'}`}
              required
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-600 mb-1">
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.phone ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 ${fieldErrors.phone ? 'focus:ring-red-500' : 'focus:ring-purple-500'}`}
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-600 mb-1">
              Email address<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.email ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 ${fieldErrors.email ? 'focus:ring-red-500' : 'focus:ring-purple-500'}`}
              required
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-600 mb-1">
              Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a password"
                className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.password ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 ${fieldErrors.password ? 'focus:ring-red-500' : 'focus:ring-purple-500'} pr-10`}
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
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-600 mb-1">
              Company name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAgency"
              checked={formData.isAgency}
              onChange={handleChange}
              className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Are you an agency?
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || Object.values(fieldErrors).some(error => error !== '')}
            className={`w-full bg-purple-600 text-white py-3 rounded-lg transition-colors ${(isLoading || Object.values(fieldErrors).some(error => error !== '')) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'}`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 font-medium hover:text-purple-700">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;