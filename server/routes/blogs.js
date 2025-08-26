const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all blogs (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    // Build query
    let query = { isPublished: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    // Build sort object
    let sort = {};
    if (sortBy === 'trending') {
      sort = { likesCount: -1, views: -1 };
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username profileImage')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username profileImage bio');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, coverImage, category, tags } = req.body;

    const blog = new Blog({
      title,
      content,
      coverImage,
      category,
      tags: tags || [],
      author: req.user.id
    });

    await blog.save();
    await blog.populate('author', 'username profileImage');

    // Update user's blog count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { blogsCount: 1 }
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update blog
router.put('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user owns the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, coverImage, category, tags } = req.body;
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, coverImage, category, tags },
      { new: true }
    ).populate('author', 'username profileImage');

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user owns the blog or is admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ blog: req.params.id });

    // Update user's blog count
    await User.findByIdAndUpdate(blog.author, {
      $inc: { blogsCount: -1 }
    });

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike blog
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const existingLike = blog.likes.find(
      like => like.user.toString() === req.user.id
    );

    if (existingLike) {
      // Unlike
      blog.likes = blog.likes.filter(
        like => like.user.toString() !== req.user.id
      );
      blog.likesCount -= 1;
    } else {
      // Like
      blog.likes.push({ user: req.user.id });
      blog.likesCount += 1;
    }

    await blog.save();

    res.json({
      liked: !existingLike,
      likesCount: blog.likesCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's blogs
router.get('/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const blogs = await Blog.find({ 
      author: req.params.userId,
      isPublished: true 
    })
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blog.countDocuments({ 
      author: req.params.userId,
      isPublished: true 
    });

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my blogs
router.get('/my/blogs', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const blogs = await Blog.find({ author: req.user.id })
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blog.countDocuments({ author: req.user.id });

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all blogs
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const blogs = await Blog.find({})
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blog.countDocuments({});

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;