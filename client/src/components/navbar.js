import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, notification, Avatar, Dropdown, Button, Upload } from 'antd';
import { HomeOutlined, LogoutOutlined, FormOutlined, InfoCircleOutlined, PhoneOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Header } = Layout;

const RssIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" fill="#1890ff">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M4 11a9 9 0 0 1 9 9" />
    <path d="M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1" />
  </svg>
);

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(true);

  const handleLogout = async () => {
    try {
      // Clear session-related data
      document.cookie = 'sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Update the state to reflect the user is logged out
      setLoggedIn(false);

      // Show notification
      notification.success({
        message: 'Logout Successful',
        description: 'You have been successfully logged out.',
      });

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);

      // Show error notification
      notification.error({
        message: 'Logout Failed',
        description: 'An error occurred during logout. Please try again.',
      });
    }
  };

  const handleAvatarChange = async (info) => {
    if (info.file.status === 'done') {
      try {
        const formData = new FormData();
        formData.append('avatar', info.file.originFileObj);

        const response = await axios.post('http://localhost:8081/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          // Handle successful avatar upload
          console.log('Avatar uploaded successfully');
          notification.success({
            message: 'Avatar Upload',
            description: 'Avatar uploaded successfully!',
          });
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        notification.error({
          message: 'Avatar Upload Failed',
          description: 'Failed to upload avatar. Please try again.',
        });
      }
    }
  };

  const menuItems = [
    { key: 'home', icon: <HomeOutlined style={{ color: '#fff' }} />, to: '/home', label: 'Home' },
    { key: 'blog', icon: <FormOutlined style={{ color: '#8a2be2' }} />, to: '/blog', label: 'Blog' },
    { key: 'feed', icon: <RssIcon style={{ color: '#fff' }} />, to: '/feed', label: 'Feed' },
    { key: 'about', icon: <InfoCircleOutlined style={{ color: '#ff7a45' }} />, to: '/about', label: 'About Us' },
    { key: 'contact', icon: <PhoneOutlined style={{ color: '#00bcd4' }} />, to: '/contact', label: 'Contact' },
  ];

  const avatarMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/profile')}>
        Profile
      </Menu.Item>
      <Menu.Item key="myposts" icon={<FormOutlined />} onClick={() => navigate('/my-posts')}>
        My Posts
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ backgroundColor: '#001529', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -6px #222' }}>
      <div
        style={{
          color: 'white',
          fontSize: '3.4em',
          fontWeight: 'bold',
          fontStyle: 'cursive',
          fontFamily: 'Brush Script MT, Brush Script Std, cursive',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.8)'
        }}
      >
        BlogBuster
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['home']}
        selectedKeys={[location.pathname]}
        style={{ lineHeight: '64px', textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.8)' }}
      >
        {menuItems.map((menuItem) => (
          <Menu.Item key={menuItem.key} icon={menuItem.icon} style={menuItemStyle(menuItem.key)}>
            <Link to={menuItem.to} style={linkStyle}>
              {menuItem.label}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      {loggedIn && (
        <Dropdown overlay={avatarMenu} placement="bottomRight" arrow>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
        </Dropdown>
      )}
    </Header>
  );
};

const menuItemStyle = (key) => ({
  fontWeight: 'bold',
  marginRight: '20px',
});

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  cursor: 'pointer',
};

export default NavBar;