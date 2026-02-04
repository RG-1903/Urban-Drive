import Category from '../models/category.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.find().sort('displayOrder');

    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: {
            categories,
        },
    });
});

export const createCategory = catchAsync(async (req, res, next) => {
    const newCategory = await Category.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            category: newCategory,
        },
    });
});

export const updateCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            category,
        },
    });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
