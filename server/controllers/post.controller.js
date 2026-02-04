import Post from '../models/post.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

// ADMIN: Create a new post
export const createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({
    ...req.body,
    author: req.user.id, // Set author from logged-in admin
  });

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

// ADMIN: Update a post
export const updatePost = catchAsync(async (req, res, next) => {
  // Remove author from body to prevent it from being updated
  const { author, ...updateData } = req.body;

  const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

// ADMIN: Delete a post
export const deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// PUBLIC: Get a single post (by slug)
export const getPostBySlug = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });

  if (!post) {
    return next(new AppError('No post found with that slug', 404));
  }
  
  // Do not show drafts to the public
  if (post.status === 'draft') {
     return next(new AppError('This post is not yet published.', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

// PUBLIC: Get all published posts
export const getAllPublishedPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Post.find({ status: 'published' }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const posts = await features.query;

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

// ADMIN: Get all posts (drafts and published)
export const getAllPostsAdmin = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const posts = await features.query;

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});