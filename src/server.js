// Load environment variables
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';
import userService from './services/userService.js';

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// User registration
app.post('/api/users/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await userService.register({ fullName, email, password });

        res.status(201).json(user);
    } catch (error) {
        console.error('Registration error:', error);

        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        res.status(500).json({ error: 'Server error' });
    }
});

// User login
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await userService.login(email, password);

        res.status(200).json(user);
    } catch (error) {
        console.error('Login error:', error);

        if (error.message === 'User not found' || error.message === 'Invalid password') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(500).json({ error: 'Server error' });
    }
});

// Get user profile
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userService.getUserById(id);

        res.status(200).json(user);
    } catch (error) {
        console.error('Get user error:', error);

        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const user = await userService.updateProfile(id, updateData);

        res.status(200).json(user);
    } catch (error) {
        console.error('Update user error:', error);

        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app; 