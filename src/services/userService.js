import User from '../models/User.js';

/**
 * User Service - Handles database operations for users
 */
const userService = {
    /**
     * Register a new user
     * @param {Object} userData - User data (fullName, email, password)
     * @returns {Promise<Object>} - Created user object
     */
    register: async (userData) => {
        try {
            const user = new User(userData);
            await user.save();

            // Return user without the password
            const userObj = user.toObject();
            delete userObj.password;

            return userObj;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Login a user
     * @param {String} email - User's email
     * @param {String} password - User's password
     * @returns {Promise<Object>} - User object if credentials are valid
     */
    login: async (email, password) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error('User not found');
            }

            // In a real app, you'd use bcrypt to compare passwords
            if (user.password !== password) {
                throw new Error('Invalid password');
            }

            // Return user without the password
            const userObj = user.toObject();
            delete userObj.password;

            return userObj;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user by ID
     * @param {String} id - User ID
     * @returns {Promise<Object>} - User object
     */
    getUserById: async (id) => {
        try {
            const user = await User.findById(id);

            if (!user) {
                throw new Error('User not found');
            }

            // Return user without the password
            const userObj = user.toObject();
            delete userObj.password;

            return userObj;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update user profile
     * @param {String} id - User ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} - Updated user object
     */
    updateProfile: async (id, updateData) => {
        try {
            const user = await User.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );

            if (!user) {
                throw new Error('User not found');
            }

            // Return user without the password
            const userObj = user.toObject();
            delete userObj.password;

            return userObj;
        } catch (error) {
            throw error;
        }
    }
};

export default userService; 