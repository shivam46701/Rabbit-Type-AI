import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        res.json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            avatar: req.user.avatar,
            settings: req.user.settings,
            stats: req.user.stats,
            createdAt: req.user.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, avatar, settings } = req.body;

        if (username) req.user.username = username;
        if (avatar) req.user.avatar = avatar;
        if (settings) req.user.settings = { ...req.user.settings, ...settings };

        await req.user.save();

        res.json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            avatar: req.user.avatar,
            settings: req.user.settings,
            stats: req.user.stats
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user stats
router.put('/stats', auth, async (req, res) => {
    try {
        const { wpm, accuracy, wordsTyped, timeSpent } = req.body;

        const stats = req.user.stats;
        stats.totalTests += 1;
        stats.totalWords += wordsTyped || 0;
        stats.totalTime += timeSpent || 0;

        if (wpm > stats.bestWpm) {
            stats.bestWpm = wpm;
        }

        // Update average WPM
        stats.avgWpm = Math.round(((stats.avgWpm * (stats.totalTests - 1)) + wpm) / stats.totalTests);
        stats.avgAccuracy = Math.round(((stats.avgAccuracy * (stats.totalTests - 1)) + accuracy) / stats.totalTests);

        await req.user.save();

        res.json({ stats });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
