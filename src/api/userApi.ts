/**
 * User API client - Handles API requests for user operations
 */

interface UserData {
    _id?: string;
    fullName: string;
    email: string;
    profilePicture: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    fullName: string;
    email: string;
    password: string;
}

const API_URL = 'http://localhost:5000/api';

const userApi = {
    /**
     * Register a new user
     * @param {RegisterData} userData - User data (fullName, email, password)
     * @returns {Promise<UserData>} - Created user object
     */
    register: async (userData: RegisterData): Promise<UserData> => {
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Login a user
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<UserData>} - User object
     */
    login: async (email: string, password: string): Promise<UserData> => {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user profile by ID
     * @param {string} id - User ID
     * @returns {Promise<UserData>} - User object
     */
    getUserProfile: async (id: string): Promise<UserData> => {
        try {
            const response = await fetch(`${API_URL}/users/${id}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch user profile');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update user profile
     * @param {string} id - User ID
     * @param {Partial<UserData>} updateData - Data to update
     * @returns {Promise<UserData>} - Updated user object
     */
    updateProfile: async (id: string, updateData: Partial<UserData>): Promise<UserData> => {
        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
};

export default userApi; 