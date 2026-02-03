import mongoose from 'mongoose';

const customPassageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 5000
    },
    category: {
        type: String,
        default: 'General',
        enum: ['General', 'Programming', 'Literature', 'Science', 'Business', 'Custom']
    },
    wordCount: {
        type: Number,
        default: 0
    },
    timesUsed: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Calculate word count before saving
customPassageSchema.pre('save', function (next) {
    this.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length;
    next();
});

export default mongoose.model('CustomPassage', customPassageSchema);
