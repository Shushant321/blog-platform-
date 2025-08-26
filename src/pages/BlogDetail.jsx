import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Comment from '../components/Comment';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar, 
  Edit, 
  Trash2,
  ArrowLeft,
  Share2
} from 'lucide-react';
import '../styles/BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (blog && user) {
      setLiked(blog.likes.some(like => like.user === user.id));
      setLikesCount(blog.likesCount);
    }
  }, [blog, user]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/api/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/blog/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`/api/blogs/${id}/like`);
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await axios.post('/api/comments', {
        content: newComment,
        blogId: id
      });
      setComments([response.data, ...comments]);
      setNewComment('');
      // Update blog's comment count
      setBlog(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = async (parentCommentId, content) => {
    try {
      const response = await axios.post('/api/comments', {
        content,
        blogId: id,
        parentCommentId
      });
      
      // Add reply to parent comment
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === parentCommentId
            ? { ...comment, replies: [...(comment.replies || []), response.data] }
            : comment
        )
      );
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
      setBlog(prev => ({ ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeleteBlog = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await axios.delete(`/api/blogs/${id}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canEdit = user && blog && (user.id === blog.author._id || user.role === 'admin');

  if (loading) {
    return <LoadingSpinner message="Loading blog..." />;
  }

  if (!blog) {
    return (
      <div className="error-container">
        <h2>Blog not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="blog-detail">
      <div className="container">
        <button 
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <article className="blog-content">
          {blog.coverImage && (
            <div className="blog-cover">
              <img src={blog.coverImage} alt={blog.title} />
            </div>
          )}

          <header className="blog-header">
            <div className="blog-meta">
              <span className="category">{blog.category}</span>
              <span className="date">
                <Calendar size={16} />
                {formatDate(blog.createdAt)}
              </span>
            </div>

            <h1 className="blog-title">{blog.title}</h1>

            <div className="blog-author">
              <Link to={`/user/${blog.author._id}`} className="author-link">
                {blog.author.profileImage ? (
                  <img 
                    src={blog.author.profileImage} 
                    alt={blog.author.username}
                    className="author-avatar"
                  />
                ) : (
                  <div className="author-avatar-placeholder">
                    {blog.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="author-info">
                  <span className="author-name">{blog.author.username}</span>
                  {blog.author.bio && <p className="author-bio">{blog.author.bio}</p>}
                </div>
              </Link>
            </div>

            <div className="blog-stats">
              <button 
                onClick={handleLike}
                className={`stat-btn ${liked ? 'liked' : ''}`}
                disabled={!isAuthenticated}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                {likesCount}
              </button>
              <span className="stat">
                <MessageCircle size={20} />
                {blog.commentsCount}
              </span>
              <span className="stat">
                <Eye size={20} />
                {blog.views}
              </span>
            </div>

            {canEdit && (
              <div className="blog-actions">
                <Link to={`/edit-blog/${blog._id}`} className="btn btn-outline">
                  <Edit size={16} />
                  Edit
                </Link>
                <button onClick={handleDeleteBlog} className="btn btn-danger">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </header>

          <div className="blog-body">
            <div 
              className="blog-content-html"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags">
              {blog.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </article>

        {/* Comments Section */}
        <section className="comments-section">
          <h3>Comments ({blog.commentsCount})</h3>

          {isAuthenticated ? (
            <form onSubmit={handleComment} className="comment-form">
              <div className="comment-author">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.username} className="comment-avatar" />
                ) : (
                  <div className="comment-avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="comment-input-group">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows="3"
                  required
                />
                <button 
                  type="submit" 
                  disabled={commentLoading || !newComment.trim()}
                  className="btn btn-primary"
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="login-prompt">
              <p>
                <Link to="/login" className="auth-link">Login</Link> to join the conversation
              </p>
            </div>
          )}

          <div className="comments-list">
            {comments.map(comment => (
              <Comment
                key={comment._id}
                comment={comment}
                onDelete={handleDeleteComment}
                onReply={handleReply}
              />
            ))}
          </div>

          {comments.length === 0 && (
            <div className="empty-comments">
              <MessageCircle size={48} />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;