import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import '../styles/BlogEditor.css';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'technology',
    tags: '',
    coverImage: ''
  });
  const [error, setError] = useState('');

  const categories = [
    'technology', 'lifestyle', 'travel', 'food', 'health', 
    'business', 'education', 'entertainment', 'sports', 'other'
  ];

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block', 'list', 'bullet',
    'link', 'image'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simple placeholder for image URL - in production, use Cloudinary
    const imageUrl = URL.createObjectURL(file);
    setFormData({
      ...formData,
      coverImage: imageUrl
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const blogData = {
        ...formData,
        tags: tagsArray
      };

      const response = await axios.post('/api/blogs', blogData);
      navigate(`/blog/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-editor">
      <div className="container">
        <div className="editor-header">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-outline"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>Create New Blog</h1>
        </div>

        {error && (
          <div className="error-alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Blog Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter an engaging title for your blog"
                className="title-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="category-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. javascript, webdev, tutorial"
                className="tags-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image</label>
            <div className="image-upload">
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="coverImage" className="file-label">
                <Upload size={20} />
                Choose Cover Image
              </label>
              {formData.coverImage && (
                <div className="image-preview">
                  <img src={formData.coverImage} alt="Cover preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Content *</label>
            <div className="editor-container">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write your blog content here..."
              />
            </div>
          </div>

          <div className="editor-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              <Save size={20} />
              {loading ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;