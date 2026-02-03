import express from 'express';
import { auth, optionalAuth } from '../middleware/auth.js';
import PerformanceMetric from '../models/PerformanceMetric.js';

const router = express.Router();

// Demo storage
const demoMetrics = new Map();

// Get user's performance history
router.get('/', auth, async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const isMongoConnected = PerformanceMetric.db?.readyState === 1;

        if (isMongoConnected) {
            const metrics = await PerformanceMetric.find({ userId: req.userId })
                .sort({ createdAt: -1 })
                .skip(parseInt(offset))
                .limit(parseInt(limit));

            const total = await PerformanceMetric.countDocuments({ userId: req.userId });

            res.json({ metrics, total });
        } else {
            const userMetrics = demoMetrics.get(req.userId?.toString()) || [];
            res.json({ metrics: userMetrics.slice(offset, offset + limit), total: userMetrics.length });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Save performance metric
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { wpm, rawWpm, accuracy, duration, textType, textLength, errors, correctChars, totalChars } = req.body;

        if (wpm === undefined || accuracy === undefined || duration === undefined) {
            return res.status(400).json({ error: 'WPM, accuracy, and duration are required' });
        }

        const isMongoConnected = PerformanceMetric.db?.readyState === 1;

        if (isMongoConnected && req.userId) {
            const metric = new PerformanceMetric({
                userId: req.userId,
                wpm,
                rawWpm: rawWpm || wpm,
                accuracy,
                duration,
                textType: textType || 'words',
                textLength: textLength || 0,
                errors: errors || 0,
                correctChars: correctChars || 0,
                totalChars: totalChars || 0
            });
            await metric.save();
            res.status(201).json(metric);
        } else {
            // Demo mode or guest
            const metric = {
                _id: Date.now().toString(),
                wpm,
                rawWpm: rawWpm || wpm,
                accuracy,
                duration,
                textType: textType || 'words',
                createdAt: new Date()
            };

            if (req.userId) {
                const userMetrics = demoMetrics.get(req.userId.toString()) || [];
                userMetrics.unshift(metric);
                demoMetrics.set(req.userId.toString(), userMetrics.slice(0, 100));
            }

            res.status(201).json(metric);
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get stats summary
router.get('/summary', auth, async (req, res) => {
    try {
        const isMongoConnected = PerformanceMetric.db?.readyState === 1;

        if (isMongoConnected) {
            const metrics = await PerformanceMetric.find({ userId: req.userId });

            if (metrics.length === 0) {
                return res.json({ totalTests: 0, avgWpm: 0, avgAccuracy: 0, bestWpm: 0 });
            }

            const totalTests = metrics.length;
            const avgWpm = Math.round(metrics.reduce((sum, m) => sum + m.wpm, 0) / totalTests);
            const avgAccuracy = Math.round(metrics.reduce((sum, m) => sum + m.accuracy, 0) / totalTests);
            const bestWpm = Math.max(...metrics.map(m => m.wpm));

            res.json({ totalTests, avgWpm, avgAccuracy, bestWpm });
        } else {
            res.json({ totalTests: 0, avgWpm: 0, avgAccuracy: 0, bestWpm: 0 });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
