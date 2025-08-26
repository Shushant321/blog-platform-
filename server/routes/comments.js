const express = require('express');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get comments for a blog
router.get('/blog/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      blog: req.params.blogId,
      parentComment: null
    })
      .populate('author', 'username profileImage')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username profileImage'
        }
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment
router.post('/', auth, async (req, res) => {
  try {
    const { content, blogId, parentCommentId } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      blog: blogId,
      parentComment: parentCommentId || null
    });

    await comment.save();
    await comment.populate('author', 'username profileImage');

    // Update blog's comment count
    if (!parentCommentId) {
      blog.commentsCount += 1;
      await blog.save();
    } else {
      // Add reply to parent comment
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or is admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all replies
    await Comment.deleteMany({ parentComment: req.params.id });

    // Remove from parent comment's replies if it's a reply
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: req.params.id }
      });
    } else {
      // Update blog's comment count if it's a main comment
      await Blog.findByIdAndUpdate(comment.blog, {
        $inc: { commentsCount: -1 }
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;