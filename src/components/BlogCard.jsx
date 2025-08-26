import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Clock } from 'lucide-react';
import '../styles/BlogCard.css';

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <article className="blog-card">
      {blog.coverImage && (
        <div className="blog-card-image">
          <Link to={`/blog/${blog._id}`}>
            <img src={blog.coverImage} alt={blog.title} />
          </Link>
        </div>
      )}
      
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span className="category">{blog.category}</span>
          <span className="date">
            <Clock size={14} />
            {formatDate(blog.createdAt)}
          </span>
        </div>

        <h3 className="blog-card-title">
          <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
        </h3>

        <p className="blog-card-excerpt">
          {truncateText(stripHtml(blog.content))}
        </p>

        <div className="blog-card-author">
          <Link to={`/user/${blog.author._id}`} className="author-info">
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
            <span className="author-name">{blog.author.username}</span>
          </Link>
        </div>

        <div className="blog-card-stats">
          <span className="stat">
            <Heart size={16} />
            {blog.likesCount}
          </span>
          <span className="stat">
            <MessageCircle size={16} />
            {blog.commentsCount}
          </span>
          <span className="stat">
            <Eye size={16} />
            {blog.views}
          </span>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-card-tags">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogCard;