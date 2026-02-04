import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A vehicle must have a name.'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'A vehicle must have a category.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'A vehicle must have a year.'],
    },
    make: {
      type: String,
      required: [true, 'A vehicle must have a make.'],
    },
    model: {
      type: String,
      required: [true, 'A vehicle must have a model.'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'A vehicle must have a price.'],
    },
    originalPrice: {
      type: Number,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    seats: {
      type: Number,
      required: [true, 'A vehicle must have a seat count.'],
    },
    transmission: {
      type: String,
      required: [true, 'A vehicle must have a transmission type.'],
    },
    fuelType: {
      type: String,
      required: [true, 'A vehicle must have a fuel type.'],
    },
    mileage: {
      type: String,
    },
    availability: {
      type: String,
      enum: ['available', 'limited', 'unavailable'],
      default: 'available',
    },

    status: {
      type: String,
      enum: ['available', 'rented', 'maintenance'],
      default: 'available',
    },
    nextMaintenance: {
      type: Date,
    },

    specialOffer: {
      type: String,
    },
    luxuryFeatures: [String],
    image: {
      type: String,
      required: [true, 'A vehicle must have a cover image.'],
    },
    imageAlt: {
      type: String,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    location: {
      type: String,
    },
    color: String,
    vin: String,
    licensePlate: String,
    securityDeposit: Number,
    highlights: [
      {
        icon: String,
        label: String,
        description: String,
      },
    ],
    specifications: {
      engine: String,
      horsepower: String,
      acceleration: String,
      topSpeed: String,
      fuelCapacity: String,
      dimensions: String,
      weight: String,
      drivetrain: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

vehicleSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'vehicle',
  localField: '_id',
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;