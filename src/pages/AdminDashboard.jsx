import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Users, 
  BookOpen, 
  Shield, 
  UserX, 
  TrendingUp,
  Calendar,
  Trash2,
  Ban
} from 'lucide-react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, blogsRes] = await Promise.all([
        axios.get('/api/users/admin/stats'),
        axios.get('/api/users/admin/all'),
        axios.get('/api/blogs/admin/all')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setBlogs(blogsRes.data.blogs);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await axios.put(`/api/users/admin/${userId}/block`);
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isBlocked: !isBlocked }
          : user
      ));
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their blogs.')) {
      return;
    }

    try {
      await axios.delete(`/api/users/admin/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await axios.delete(`/api/blogs/${blogId}`);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>
            <Shield size={32} />
            Admin Dashboard
          </h1>
          <p>Manage users, blogs, and monitor platform activity</p>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon users">
              <Users />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon blogs">
              <BookOpen />
            </div>
            <div className="stat-content">
              <h3>{stats.totalBlogs}</h3>
              <p>Total Blogs</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon admins">
              <Shield />
            </div>
            <div className="stat-content">
              <h3>{stats.totalAdmins}</h3>
              <p>Admin Users</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon blocked">
              <UserX />
            </div>
            <div className="stat-content">
              <h3>{stats.blockedUsers}</h3>
              <p>Blocked Users</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>Recent Activity (Last 7 Days)</h3>
          <div className="activity-grid">
            <div className="activity-item">
              <Calendar className="activity-icon" />
              <div className="activity-content">
                <h4>{stats.recentUsers}</h4>
                <p>New Users</p>
              </div>
            </div>
            <div className="activity-item">
              <TrendingUp className="activity-icon" />
              <div className="activity-content">
                <h4>{stats.recentBlogs}</h4>
                <p>New Blogs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab('stats')}
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
          >
            Blogs ({blogs.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="admin-tab-content">
          {activeTab === 'stats' && (
            <div className="stats-content">
              {stats.topBlogs && stats.topBlogs.length > 0 && (
                <div className="top-blogs">
                  <h3>Most Liked Blogs</h3>
                  <div className="top-blogs-list">
                    {stats.topBlogs.map((blog, index) => (
                      <div key={blog._id} className="top-blog-item">
                        <span className="rank">#{index + 1}</span>
                        <div className="blog-info">
                          <h4>{blog.title}</h4>
                          <p>by {blog.author.username} • {blog.likesCount} likes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-content">
              <div className="users-header">
                <h3>Manage Users</h3>
              </div>

              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Blogs</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-cell">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.username} className="table-avatar" />
                            ) : (
                              <div className="table-avatar-placeholder">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span>{user.username}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.blogsCount || 0}</td>
                        <td>
                          <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="table-actions">
                            {user.role !== 'admin' && (
                              <>
                                <button
                                  onClick={() => handleBlockUser(user._id, user.isBlocked)}
                                  className={`btn btn-sm ${user.isBlocked ? 'btn-success' : 'btn-warning'}`}
                                  title={user.isBlocked ? 'Unblock User' : 'Block User'}
                                >
                                  <Ban size={14} />
                                  {user.isBlocked ? 'Unblock' : 'Block'}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="btn btn-danger btn-sm"
                                  title="Delete User"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'blogs' && (
            <div className="blogs-content">
              <div className="blogs-header">
                <h3>Manage Blogs</h3>
              </div>

              <div className="blogs-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Likes</th>
                      <th>Views</th>
                      <th>Published</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map(blog => (
                      <tr key={blog._id}>
                        <td>
                          <div className="blog-title-cell">
                            <h4>{blog.title}</h4>
                          </div>
                        </td>
                        <td>
                          <div className="author-cell">
                            <span>{blog.author.username}</span>
                            <small>{blog.author.email}</small>
                          </div>
                        </td>
                        <td>
                          <span className="category-badge">{blog.category}</span>
                        </td>
                        <td>{blog.likesCount}</td>
                        <td>{blog.views}</td>
                        <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="btn btn-danger btn-sm"
                              title="Delete Blog"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;