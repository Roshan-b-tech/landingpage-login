require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Allow requests from frontend or any origin in development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for profile pictures
app.use(express.urlencoded({ extended: true }));

// In-memory storage (for demo purposes)
const users = [];

// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

// User routes
app.post('/api/users/register', (req, res) => {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user (in a real app, password would be hashed)
    const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
        createdAt: new Date()
    };

    users.push({ ...newUser, password }); // Store with password in memory

    // Return user data without password
    res.status(201).json(newUser);
});

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Find user
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    users[userIndex] = { ...users[userIndex], ...updates };

    // Return updated user without password
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.status(200).json(userWithoutPassword);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 