const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');  // path module add karna hai

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogplatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/users', require('./routes/users'));
app.use('/api/comments', require('./routes/comments'));

// Serve React frontend from dist folder (jo 'src/dist' me hai)
app.use(express.static(path.join(__dirname, '../src/dist')));

// For all other routes, serve React index.html (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/dist/index.html'));
});

// Health check endpoint (agar chahiye to skip kar sakte ho)
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
