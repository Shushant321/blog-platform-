import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Trash2 } from 'lucide-react';
import '../styles/Comment.css';

const Comment = ({ comment, onDelete, onReply }) => {
  const { user, isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    await onReply(comment._id, replyContent);
    setReplyContent('');
    setShowReplyForm(false);
  };

  const canDelete = user && (user.id === comment.author._id || user.role === 'admin');

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-author">
          {comment.author.profileImage ? (
            <img 
              src={comment.author.profileImage} 
              alt={comment.author.username}
              className="comment-avatar"
            />
          ) : (
            <div className="comment-avatar-placeholder">
              {comment.author.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="comment-info">
            <span className="comment-username">{comment.author.username}</span>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
        </div>

        {canDelete && (
          <button 
            onClick={() => onDelete(comment._id)}
            className="comment-delete-btn"
            title="Delete comment"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="comment-content">
        <p>{comment.content}</p>
      </div>

      <div className="comment-actions">
        {isAuthenticated && (
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="reply-btn"
          >
            <MessageCircle size={16} />
            Reply
          </button>
        )}
      </div>

      {showReplyForm && (
        <form onSubmit={handleReply} className="reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows="3"
            required
          />
          <div className="reply-form-actions">
            <button type="submit" className="btn btn-primary btn-sm">
              Reply
            </button>
            <button 
              type="button" 
              onClick={() => setShowReplyForm(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => (
            <Comment
              key={reply._id}
              comment={reply}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;