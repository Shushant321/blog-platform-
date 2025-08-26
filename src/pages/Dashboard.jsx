import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { PenTool, BookOpen, Heart, Eye, Edit, Trash2 } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalLikes: 0,
    totalViews: 0
  });

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    try {
      const response = await axios.get('/api/blogs/my/blogs');
      setBlogs(response.data.blogs);
      
      // Calculate stats
      const totalLikes = response.data.blogs.reduce((sum, blog) => sum + blog.likesCount, 0);
      const totalViews = response.data.blogs.reduce((sum, blog) => sum + blog.views, 0);
      
      setStats({
        totalBlogs: response.data.blogs.length,
        totalLikes,
        totalViews
      });
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await axios.delete(`/api/blogs/${blogId}`);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      setStats(prev => ({
        ...prev,
        totalBlogs: prev.totalBlogs - 1
      }));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="user-welcome">
            <div className="user-avatar-large">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.username} />
              ) : (
                <div className="avatar-placeholder-large">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="welcome-text">
              <h1>Welcome back, {user.username}!</h1>
              <p>Manage your blogs and track your writing journey</p>
            </div>
          </div>
          
          <Link to="/create-blog" className="btn btn-primary">
            <PenTool size={20} />
            Write New Blog
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <BookOpen />
            </div>
            <div className="stat-content">
              <h3>{stats.totalBlogs}</h3>
              <p>Total Blogs</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Heart />
            </div>
            <div className="stat-content">
              <h3>{stats.totalLikes}</h3>
              <p>Total Likes</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Eye />
            </div>
            <div className="stat-content">
              <h3>{stats.totalViews}</h3>
              <p>Total Views</p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
          >
            My Blogs ({blogs.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            Profile Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-cards">
                  <Link to="/create-blog" className="action-card">
                    <PenTool size={24} />
                    <h4>Write a Blog</h4>
                    <p>Share your thoughts with the world</p>
                  </Link>
                </div>
              </div>

              {blogs.length > 0 && (
                <div className="recent-blogs">
                  <h3>Recent Blogs</h3>
                  <div className="blogs-grid">
                    {blogs.slice(0, 4).map(blog => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>
                  {blogs.length > 4 && (
                    <div className="see-all">
                      <button 
                        onClick={() => setActiveTab('blogs')}
                        className="btn btn-outline"
                      >
                        View All Blogs
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'blogs' && (
            <div className="blogs-content">
              <div className="blogs-header">
                <h3>My Blogs</h3>
                <Link to="/create-blog" className="btn btn-primary">
                  <PenTool size={16} />
                  New Blog
                </Link>
              </div>

              {blogs.length > 0 ? (
                <div className="blogs-list">
                  {blogs.map(blog => (
                    <div key={blog._id} className="blog-item">
                      <div className="blog-item-content">
                        <h4>
                          <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                        </h4>
                        <p className="blog-meta">
                          {new Date(blog.createdAt).toLocaleDateString()} • 
                          {blog.category} • 
                          {blog.likesCount} likes • 
                          {blog.views} views
                        </p>
                      </div>
                      <div className="blog-item-actions">
                        <Link 
                          to={`/edit-blog/${blog._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          <Edit size={16} />
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <PenTool size={64} className="empty-icon" />
                  <h4>No blogs yet</h4>
                  <p>Start writing your first blog to share your thoughts!</p>
                  <Link to="/create-blog" className="btn btn-primary">
                    Write Your First Blog
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-content">
              <div className="profile-form">
                <h3>Profile Settings</h3>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={user.username} 
                    readOnly
                    className="form-control"
                  />
                  <small>Username cannot be changed</small>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={user.email} 
                    readOnly
                    className="form-control"
                  />
                  <small>Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input 
                    type="text" 
                    value={user.role} 
                    readOnly
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;