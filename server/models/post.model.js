import mongoose from 'mongoose';
import slugify from 'slugify'; // We'll need to install this package

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a title.'],
      unique: true,
      trim: true,
    },
    slug: String,
    content: {
      type: String,
      required: [true, 'A post must have content.'],
    },
    featuredImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc',
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // Assumes an admin's User ID will be used
      required: [true, 'A post must have an author.'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a URL-friendly slug from the title before saving
postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Populate the author field on every query
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'firstName lastName avatar',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;