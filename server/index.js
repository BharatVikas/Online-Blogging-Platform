const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const app = express();
const port = 8081;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://vicky:admin@cluster0.q8y48za.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/blogbuster');

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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bharatvikas04062004@gmail.com', // Your Gmail email address
    pass: 'vbhi uebj hyte ccnp', // Your Gmail password
  }
});

const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const otp = generateOTP();
    const mailOptions = {
      from: 'bharatvikas04062004@gmail.com', // Your Gmail email address
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

app.get('/api/feed', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.status(200).json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Logout endpoint
app.post('/api/logout', async (req, res) => {
  try {
    // Clear any session-related data here
    // For example, if using session-based authentication, destroy the session
    // For now, let's assume you're clearing the session cookie
    res.clearCookie('sessionID'); // Assuming the session cookie is named 'sessionID'

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

