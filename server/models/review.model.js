import mongoose from 'mongoose';
import Vehicle from './vehicle.model.js';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review content cannot be empty.'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating.'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    vehicle: {
      type: mongoose.Schema.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Review must belong to a vehicle.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
    userTitle: {
      type: String,
      trim: true,
    },
    userCompany: {
      type: String,
      trim: true,
    },
    userLocation: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ vehicle: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName avatar',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (vehicleId) {
  const stats = await this.aggregate([
    {
      $match: { vehicle: vehicleId },
    },
    {
      $group: {
        _id: '$vehicle',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      ratingQuantity: 0,
      ratingAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.vehicle);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.vehicle);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;