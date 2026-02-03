import express from 'express';
import { auth } from '../middleware/auth.js';
import CustomPassage from '../models/CustomPassage.js';

const router = express.Router();

// Demo storage
const demoPassages = new Map();

// Get all user passages
router.get('/', auth, async (req, res) => {
    try {
        const isMongoConnected = CustomPassage.db?.readyState === 1;

        if (isMongoConnected) {
            const passages = await CustomPassage.find({ userId: req.userId })
                .sort({ createdAt: -1 });
            res.json(passages);
        } else {
            const userPassages = demoPassages.get(req.userId?.toString()) || [];
            res.json(userPassages);
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new passage
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const isMongoConnected = CustomPassage.db?.readyState === 1;

        if (isMongoConnected) {
            const passage = new CustomPassage({
                userId: req.userId,
                title,
                content,
                category: category || 'General'
            });
            await passage.save();
            res.status(201).json(passage);
        } else {
            const passage = {
                _id: Date.now().toString(),
                userId: req.userId,
                title,
                content,
                category: category || 'General',
                wordCount: content.split(/\s+/).length,
                timesUsed: 0,
                createdAt: new Date()
            };
            const userPassages = demoPassages.get(req.userId?.toString()) || [];
            userPassages.push(passage);
            demoPassages.set(req.userId?.toString(), userPassages);
            res.status(201).json(passage);
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update passage
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const isMongoConnected = CustomPassage.db?.readyState === 1;

        if (isMongoConnected) {
            const passage = await CustomPassage.findOneAndUpdate(
                { _id: req.params.id, userId: req.userId },
                { title, content, category },
                { new: true }
            );
            if (!passage) {
                return res.status(404).json({ error: 'Passage not found' });
            }
            res.json(passage);
        } else {
            res.json({ _id: req.params.id, title, content, category });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete passage
router.delete('/:id', auth, async (req, res) => {
    try {
        const isMongoConnected = CustomPassage.db?.readyState === 1;

        if (isMongoConnected) {
            const passage = await CustomPassage.findOneAndDelete({
                _id: req.params.id,
                userId: req.userId
            });
            if (!passage) {
                return res.status(404).json({ error: 'Passage not found' });
            }
        }
        res.json({ message: 'Passage deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
