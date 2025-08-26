import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Calendar, BookOpen } from 'lucide-react';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userRes, blogsRes] = await Promise.all([
        axios.get(`/api/users/${id}`),
        axios.get(`/api/blogs/user/${id}`)
      ]);

      setUser(userRes.data);
      setBlogs(blogsRes.data.blogs);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading user profile..." />;
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2>User not found</h2>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.username} />
            ) : (
              <div className="avatar-placeholder-large">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h1>{user.username}</h1>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            
            <div className="profile-meta">
              <span className="meta-item">
                <Calendar size={16} />
                Joined {formatDate(user.createdAt)}
              </span>
              <span className="meta-item">
                <BookOpen size={16} />
                {user.blogsCount || blogs.length} blogs
              </span>
            </div>

            <div className="profile-role">
              <span className={`role-badge ${user.role}`}>
                {user.role === 'admin' ? 'Administrator' : 'Writer'}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="content-header">
            <h2>
              <BookOpen size={24} />
              Published Blogs ({blogs.length})
            </h2>
          </div>

          {blogs.length > 0 ? (
            <div className="blogs-grid">
              {blogs.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <BookOpen size={64} className="empty-icon" />
              <h3>No blogs published yet</h3>
              <p>This user hasn't published any blogs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;