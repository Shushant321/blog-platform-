import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { Save, ArrowLeft, Upload } from "lucide-react";
import "../styles/BlogEditor.css";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "technology",
    tags: "",
    coverImage: "",
  });
  const [error, setError] = useState("");

  const categories = [
    "technology",
    "lifestyle",
    "travel",
    "food",
    "health",
    "business",
    "education",
    "entertainment",
    "sports",
    "other",
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "link",
    "image",
  ];

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/api/blogs/${id}`);
      const blog = response.data;

      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        tags: blog.tags.join(", "),
        coverImage: blog.coverImage,
      });
    } catch (error) {
      setError("Failed to load blog");
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_unsigned_upload_preset"); // Cloudinary dashboard se banaya hua preset

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dly1ea4h9/image/upload`,
        data
      );

      setFormData((prev) => ({
        ...prev,
        coverImage: res.data.secure_url,
      }));
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const blogData = {
        ...formData,
        tags: tagsArray,
      };

      await axios.put(`/api/blogs/${id}`, blogData);
      navigate(`/blog/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading blog..." />;
  }

  return (
    <div className="blog-editor">
      <div className="container">
        <div className="editor-header">
          <button onClick={() => navigate(-1)} className="btn btn-outline">
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>Edit Blog</h1>
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
                {categories.map((cat) => (
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
                Change Cover Image
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
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={20} />
              {saving ? "Saving..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
