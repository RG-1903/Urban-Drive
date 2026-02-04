import Contact from '../models/contactModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Create a new contact submission
export const createContact = catchAsync(async (req, res, next) => {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({
        name,
        email,
        phone,
        subject,
        message
    });

    res.status(201).json({
        status: 'success',
        data: {
            contact
        }
    });
});

// Get all contact submissions (Admin only)
export const getAllContacts = catchAsync(async (req, res, next) => {
    const contacts = await Contact.find().sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: contacts.length,
        data: {
            contacts
        }
    });
});

// Get single contact
export const getContact = catchAsync(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        return next(new AppError('Contact not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            contact
        }
    });
});

// Update contact status (Admin only)
export const updateContact = catchAsync(async (req, res, next) => {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { status },
        {
            new: true,
            runValidators: true
        }
    );

    if (!contact) {
        return next(new AppError('Contact not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            contact
        }
    });
});

// Delete contact (Admin only)
export const deleteContact = catchAsync(async (req, res, next) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
        return next(new AppError('Contact not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
