import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A category must have a name.'],
            unique: true,
            trim: true,
        },
        subtitle: {
            type: String,
            required: [true, 'A category must have a subtitle.'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'A category must have a description.'],
            trim: true,
        },
        features: {
            type: [String],
            required: [true, 'A category must have features.'],
        },
        badge: {
            type: String,
            required: [true, 'A category must have a badge text.'],
            trim: true,
        },
        gradient: {
            type: String,
            required: [true, 'A category must have a gradient class.'],
            default: 'from-slate-500 to-gray-600',
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
