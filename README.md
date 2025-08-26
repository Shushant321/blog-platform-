# MERN Stack Blogging Platform

A full-featured blogging platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, role-based access control, rich text editing, and comprehensive admin panel.

## 🚀 Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure login/register system
- **Role-based Access Control**: Separate dashboards for users and admins
- **Protected Routes**: Authentication guards for sensitive pages
- **Session Management**: Persistent login with token refresh

### Blog Management
- **Rich Text Editor**: React Quill integration for advanced formatting
- **CRUD Operations**: Create, read, update, delete blogs
- **Image Upload**: Cloudinary integration for cover images
- **Categories & Tags**: Organize content with categories and tags
- **Search & Filter**: Advanced search and filtering capabilities

### User Interaction
- **Like System**: Users can like/unlike blog posts
- **Comment System**: Nested comments with replies
- **User Profiles**: Public profile pages with user's blogs
- **Social Features**: Follow authors and engage with content

### Admin Panel
- **Dashboard Analytics**: User and blog statistics
- **User Management**: Block/unblock and delete users
- **Content Moderation**: Delete inappropriate blogs and comments
- **Activity Monitoring**: Track recent platform activity

### Technical Features
- **Responsive Design**: Mobile-first CSS design
- **Performance Optimized**: Lazy loading and pagination
- **SEO Friendly**: Meta tags and structured data
- **Error Handling**: Comprehensive error management
- **Security**: Input validation and sanitization

## 🛠️ Tech Stack

### Frontend
- **React.js**: UI library with hooks and context
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **React Quill**: Rich text editor
- **Lucide React**: Modern icon library
- **CSS3**: Custom responsive styling

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Cloudinary**: Image upload and management
- **CORS**: Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-blogging-platform
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/blogplatform
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Start the backend server**
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   # From project root
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

### Full Stack Development

Run both frontend and backend concurrently:
```bash
npm run dev
```

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin']),
  profileImage: String,
  bio: String,
  isBlocked: Boolean,
  blogsCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Model
```javascript
{
  title: String (required),
  content: String (required),
  coverImage: String,
  category: String (required),
  tags: [String],
  author: ObjectId (ref: User),
  likes: [{ user: ObjectId }],
  likesCount: Number,
  commentsCount: Number,
  views: Number,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  content: String (required),
  author: ObjectId (ref: User),
  blog: ObjectId (ref: Blog),
  parentComment: ObjectId (ref: Comment),
  replies: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Blog Routes
- `GET /api/blogs` - Get all blogs (public)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (auth required)
- `PUT /api/blogs/:id` - Update blog (auth required)
- `DELETE /api/blogs/:id` - Delete blog (auth required)
- `POST /api/blogs/:id/like` - Like/unlike blog (auth required)
- `GET /api/blogs/my/blogs` - Get user's blogs (auth required)

### User Management Routes
- `GET /api/users/:id` - Get user profile
- `GET /api/users/admin/all` - Get all users (admin only)
- `PUT /api/users/admin/:id/block` - Block/unblock user (admin only)
- `DELETE /api/users/admin/:id` - Delete user (admin only)
- `GET /api/users/admin/stats` - Get admin statistics (admin only)

### Comment Routes
- `GET /api/comments/blog/:blogId` - Get blog comments
- `POST /api/comments` - Create comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Modern gradient-based color scheme
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: 8px grid system for consistent spacing
- **Components**: Reusable button, form, and card components

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color ratios
- **Focus Management**: Visible focus indicators

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)

2. **Deploy Backend**
   - Connect your GitHub repository
   - Set environment variables in Render dashboard
   - Deploy as a Web Service

3. **Environment Variables**
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_production_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=production
   ```

### Frontend Deployment (Netlify/Vercel)

1. **Build the Frontend**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or connect GitHub repository for automatic deployments

3. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] User registration with validation
- [ ] User login with correct/incorrect credentials
- [ ] JWT token persistence
- [ ] Logout functionality
- [ ] Protected route access

#### Blog Operations
- [ ] Create blog with rich text content
- [ ] Edit existing blog
- [ ] Delete blog with confirmation
- [ ] View blog with comments
- [ ] Like/unlike functionality

#### Admin Features
- [ ] Admin dashboard access
- [ ] User management (block/unblock/delete)
- [ ] Blog moderation
- [ ] Statistics display

#### Responsive Design
- [ ] Mobile navigation
- [ ] Tablet layout
- [ ] Desktop experience
- [ ] Cross-browser compatibility

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing library
- **MongoDB** for the flexible database
- **Cloudinary** for image management
- **Lucide** for beautiful icons
- **React Quill** for rich text editing

## 📞 Support

For support, email support@blogplatform.com or create an issue in the GitHub repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added comment system and user profiles
- **v1.2.0** - Enhanced admin panel and analytics
- **v1.3.0** - Mobile optimization and performance improvements

---

**Built with ❤️ using the MERN Stack**#   b l o g - p l a t f o r m -  
 