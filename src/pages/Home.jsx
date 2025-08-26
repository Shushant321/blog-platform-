import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import SearchFilters from '../components/SearchFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import { TrendingUp, Clock, Users, PenTool } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sortBy: 'createdAt'
  });

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, filters]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...filters
      };

      const response = await axios.get('/api/blogs', { params });
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (error) {
      setError('Failed to fetch blogs');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const handleFilter = (category) => {
    setFilters(prev => ({ ...prev, category }));
    setCurrentPage(1);
  };

  const handleSort = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && currentPage === 1) {
    return <LoadingSpinner message="Loading blogs..." />;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Share Your Story with the World
            </h1>
            <p className="hero-description">
              Join thousands of writers sharing their thoughts, experiences, and insights 
              on our modern blogging platform.
            </p>
            {!isAuthenticated ? (
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  <PenTool size={20} />
                  Start Writing
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="hero-actions">
                <Link to="/create-blog" className="btn btn-primary btn-lg">
                  <PenTool size={20} />
                  Write a Blog
                </Link>
                <Link to="/dashboard" className="btn btn-outline btn-lg">
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <PenTool className="feature-icon" />
              <h3>Rich Text Editor</h3>
              <p>Create beautiful blogs with our intuitive rich text editor supporting images, formatting, and more.</p>
            </div>
            <div className="feature-card">
              <Users className="feature-icon" />
              <h3>Engage with Community</h3>
              <p>Connect with readers through comments, likes, and build your own following.</p>
            </div>
            <div className="feature-card">
              <TrendingUp className="feature-icon" />
              <h3>Discover Trending</h3>
              <p>Find the most popular content and stay updated with what's trending in your interests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Feed */}
      <section className="blog-feed">
        <div className="container">
          <div className="feed-header">
            <h2 className="section-title">
              <Clock size={28} />
              Latest Blogs
            </h2>
            <SearchFilters
              onSearch={handleSearch}
              onFilter={handleFilter}
              onSort={handleSort}
            />
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchBlogs} className="btn btn-primary">
                Try Again
              </button>
            </div>
          )}

          {blogs?.length > 0 ? (
            <>
              <div className="blogs-grid">
                {blogs.map(blog => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-outline"
                  >
                    Previous
                  </button>
                  
                  <div className="page-numbers">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <div className="empty-state">
                <PenTool size={64} className="empty-icon" />
                <h3>No blogs found</h3>
                <p>Be the first to share your story!</p>
                {isAuthenticated && (
                  <Link to="/create-blog" className="btn btn-primary">
                    Write Your First Blog
                  </Link>
                )}
              </div>
            )
          )}

          {loading && currentPage > 1 && (
            <div className="loading-more">
              <LoadingSpinner size="small" message="Loading more blogs..." />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;