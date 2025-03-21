import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import userApi from '../api/userApi';

// Set this to true to use local storage only (no backend)
const USE_LOCAL_STORAGE_ONLY = true;

// Set this to true to skip authentication checks during testing
const SKIP_AUTH_CHECK = false;

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface UserData {
  _id?: string;
  fullName: string;
  email: string;
  profilePicture: string;
  password?: string; // Optional as we don't always want to expose it
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  updateProfilePicture: (imageBase64: string) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { fullName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const defaultUserData: UserData = {
  fullName: '',
  email: '',
  profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80'
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isAuthenticated, setIsAuthenticated] = useState(SKIP_AUTH_CHECK);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    if (SKIP_AUTH_CHECK) {
      // For testing, generate a test user
      const testUser = {
        _id: 'test123',
        fullName: 'Test User',
        email: 'test@example.com',
        profilePicture: defaultUserData.profilePicture
      };
      setUserData(testUser);
      localStorage.setItem('user', JSON.stringify(testUser));
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const updateUserData = async (data: Partial<UserData>) => {
    setIsLoading(true);
    setError(null);

    try {
      let updatedUser;

      if (USE_LOCAL_STORAGE_ONLY || !userData._id) {
        // Just update local state
        updatedUser = { ...userData, ...data };
      } else {
        // Update user in database
        updatedUser = await userApi.updateProfile(userData._id, data);
      }

      // Update local state
      setUserData(prev => ({ ...prev, ...updatedUser }));

      // Update localStorage
      localStorage.setItem('user', JSON.stringify({ ...userData, ...updatedUser }));

      // If this is updating a registered user, also update in registeredUsers
      if (userData.email && USE_LOCAL_STORAGE_ONLY) {
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const updatedUsers = users.map((user: UserData) => {
            if (user.email === userData.email) {
              // Keep the password intact
              return {
                ...user,
                ...updatedUser,
                password: user.password // Ensure password is preserved
              };
            }
            return user;
          });
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfilePicture = async (imageBase64: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Update user data with new profile picture
      const updatedData = { ...userData, profilePicture: imageBase64 };

      // Update local state
      setUserData(updatedData);

      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(updatedData));

      // Update in registeredUsers to make it persistent across logins
      if (userData.email && USE_LOCAL_STORAGE_ONLY) {
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const updatedUsers = users.map((user: UserData) => {
            if (user.email === userData.email) {
              return {
                ...user,
                profilePicture: imageBase64,
                password: user.password // Ensure password is preserved
              };
            }
            return user;
          });
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate email format
      if (!EMAIL_REGEX.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      let user;

      if (USE_LOCAL_STORAGE_ONLY) {
        // Simple local validation
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        // Check if user exists in localStorage (has registered)
        const storedUsers = localStorage.getItem('registeredUsers');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const userExists = users.find((u: UserData) => u.email === email);

        if (!userExists) {
          throw new Error('User not registered. Please sign up first.');
        }

        // Verify password
        if (userExists.password !== password) {
          throw new Error('Invalid password');
        }

        // Return user without password
        user = { ...userExists };
        delete user.password;
      } else {
        // Real API login
        user = await userApi.login(email, password);
      }

      setUserData(user);
      setIsAuthenticated(true);

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (newUserData: { fullName: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate email format
      if (!EMAIL_REGEX.test(newUserData.email)) {
        throw new Error('Please enter a valid email address');
      }

      let user;

      if (USE_LOCAL_STORAGE_ONLY) {
        // Simple local validation
        if (!newUserData.fullName || !newUserData.email || !newUserData.password) {
          throw new Error('All fields are required');
        }

        // Check if email already exists
        const storedUsers = localStorage.getItem('registeredUsers');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const emailExists = users.some((u: UserData) => u.email === newUserData.email);

        if (emailExists) {
          throw new Error('Email already registered. Please login instead.');
        }

        // Generate an ID
        const id = Math.random().toString(36).substring(2, 15);
        user = {
          _id: id,
          fullName: newUserData.fullName,
          email: newUserData.email,
          profilePicture: defaultUserData.profilePicture
        };

        // Store the user with password in registeredUsers
        const registeredUser = {
          ...user,
          password: newUserData.password
        };

        users.push(registeredUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      } else {
        // Real API registration
        user = await userApi.register(newUserData);
      }

      setUserData(user);
      setIsAuthenticated(true);

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUserData(defaultUserData);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        updateUserData,
        updateProfilePicture,
        isAuthenticated,
        login,
        register,
        logout,
        isLoading,
        error,
        clearError
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};