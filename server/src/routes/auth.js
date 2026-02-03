import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Demo mode storage (when MongoDB is not available)
const demoUsers = new Map();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if using MongoDB
        const isMongoConnected = User.db?.readyState === 1;

        if (isMongoConnected) {
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const user = new User({ username, email, password });
            await user.save();

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    stats: user.stats
                }
            });
        } else {
            // Demo mode
            if (demoUsers.has(email)) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const demoUser = {
                id: Date.now().toString(),
                username,
                email,
                password,
                avatar: '🐰',
                stats: { totalTests: 0, totalWords: 0, bestWpm: 0, avgWpm: 0, avgAccuracy: 0 }
            };
            demoUsers.set(email, demoUser);

            const token = jwt.sign({ userId: demoUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                token,
                user: { id: demoUser.id, username, email, avatar: '🐰', stats: demoUser.stats }
            });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const isMongoConnected = User.db?.readyState === 1;

        if (isMongoConnected) {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    stats: user.stats
                }
            });
        } else {
            // Demo mode
            const demoUser = demoUsers.get(email);
            if (!demoUser || demoUser.password !== password) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: demoUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                token,
                user: { id: demoUser.id, username: demoUser.username, email, avatar: demoUser.avatar, stats: demoUser.stats }
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
