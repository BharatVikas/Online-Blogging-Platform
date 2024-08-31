const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 8081;

// CORS configuration
const corsOptions = {
  origin: 'https://online-blogging-platform.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB using environment variables for security
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the User model
const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      otp: { type: String },
    },
    { collection: 'users' }
  )
);

// Define the BlogPost model
const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    tags: [String],
    media: String,
    privacy: String,
    publicationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'blogposts' }
);

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bharatvikas04062004@gmail.com', // Your Gmail email address
    pass: 'vbhi uebj hyte ccnp', // Your Gmail password
  }
});

/ Function to generate OTP
const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Signup route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const otp = generateOTP();
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your Gmail email address
      to: email,
      subject: 'Verification from Blogbuster',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, otp });
    await newUser.save();

    res.status(201).json({ message: 'User signed up successfully! Please check your email for OTP verification.' });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// OTP verification route
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email, otp });

    if (!user) {
      console.log('Invalid OTP');
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    console.log('OTP verified successfully');
    await User.updateOne({ email }, { $unset: { otp: 1 } });

    res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('Error during OTP verification:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Login successful');
    res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Blog post submission route
app.post('/api/blog', upload.single('media'), async (req, res) => {
  try {
    const { title, content, tags, privacy, author } = req.body;
    const mediaData = req.file ? req.file.buffer.toString('base64') : null;

    const blogPost = new BlogPost({
      title,
      content,
      tags: tags.split(',').map((tag) => tag.trim()),
      privacy,
      author: { username: author },
      media: mediaData,
    });

    await blogPost.save();

    res.status(201).json({ message: 'Blog post submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Blog feed retrieval route
app.get('/api/feed', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.status(200).json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Logout route
app.post('/api/logout', async (req, res) => {
  try {
    // Clear session-related data (e.g., session cookies)
    res.clearCookie('sessionID');

    console.log('Logout successful');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
