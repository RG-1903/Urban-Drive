import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Booking must belong to a vehicle.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user.'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Booking must have a total price.'],
    },
    startDate: {
      type: Date,
      required: [true, 'Booking must have a start date.'],
    },
    endDate: {
      type: Date,
      required: [true, 'Booking must have an end date.'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'active'],
      default: 'confirmed',
    },
    pickupLocation: {
      type: String,
      required: [true, 'Booking must have a pickup location.'],
    },
    returnLocation: {
      type: String,
      required: [true, 'Booking must have a return location.'],
    },
    insurance: {
      name: String,
      price: Number,
    },
    extras: [
      {
        id: String,
        name: String,
        price: Number,
      },
    ],
    paymentInfo: {
      status: {
        type: String,
        default: 'succeeded',
      },
      method: String,
      transactionId: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  }).populate({
    path: 'vehicle',
    select: 'name image imageAlt',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;