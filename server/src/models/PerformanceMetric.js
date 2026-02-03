import mongoose from 'mongoose';

const performanceMetricSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wpm: {
        type: Number,
        required: true,
        min: 0
    },
    rawWpm: {
        type: Number,
        required: true,
        min: 0
    },
    accuracy: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    textType: {
        type: String,
        enum: ['ai', 'custom', 'quote', 'words'],
        default: 'words'
    },
    textLength: {
        type: Number,
        default: 0
    },
    errors: {
        type: Number,
        default: 0
    },
    correctChars: {
        type: Number,
        default: 0
    },
    totalChars: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('PerformanceMetric', performanceMetricSchema);
