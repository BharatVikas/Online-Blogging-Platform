import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/login';
import Signup from './components/signup';
import Profile from './components/profile';
import BlogPage from './components/blog';
import BlogFeed from './components/feed';
import Contact from './components/contact';
import About from './components/about';
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider

const App = () => {
  return (
    <Router>
      <AuthProvider> {/* Wrap routes with AuthProvider */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/feed" element={<BlogFeed />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
