import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import backgroundImage from './signup.jpg';
import axios from 'axios';

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url(${backgroundImage}) center/cover no-repeat;
`;

const SignupForm = styled(Form)`
  max-width: 400px;
  width: 100%;
  padding: 30px;
  background: #f5e2ca;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const CustomInput = styled(Input)`
  height: 48px;
`;

const CustomPasswordInput = styled(Input.Password)`
  height: 48px;
`;

const SignupButton = styled(Button)`
  background-color: #8B4513;
  border-color: #8B4513;
  color: #fff;
  font-weight: bold;

  &:hover {
    background-color: #A0522D;
    border-color: #A0522D;
  }
`;

const StyledLink = styled(Link)`
  color: #3498db;
  &:hover {
    color: #2980b9;
  }
`;

const BlockbusterText = styled.h2`
  text-align: center;
  color: #8B4513;
  margin-bottom: 16px;
  font-size: 36px;
  font-family: 'Georgia', serif;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Signup = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    otp: '',
  });
  const [otpAttempts, setOtpAttempts] = useState(0);

  const openNotification = (type, message) => {
    notification[type]({
      message: 'Notification',
      description: message,
    });
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('https://online-blogging-platform-vafr.vercel.app/signup', formData);
      if (response.status === 201) {
        setOtpSent(true);
        setOtpAttempts(0);
        openNotification('success', 'OTP sent to your email. Please verify.');
      }
    } catch (error) {
      console.error('Signup failed:', error.message);
      if (error.response && error.response.status === 400) {
        openNotification('error', 'Username or email already exists. Please choose another.');
      }
    }
  };

  const handleOTPVerification = async () => {
    try {
      const response = await axios.post('https://online-blogging-platform-vafr.vercel.app/verify-otp', formData);
      if (response.status === 200) {
        openNotification('success', 'OTP verified successfully! You can now log in.');
        navigate('/login');
      }
    } catch (error) {
      console.error('OTP verification failed:', error.message);
      setOtpAttempts(otpAttempts + 1);
      if (otpAttempts >= 2) {
        openNotification('error', 'Maximum OTP attempts reached. Please sign up again.');
        setOtpSent(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          otp: '',
        });
      } else {
        openNotification('error', 'Invalid OTP. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <SignupContainer>
      <SignupForm name="signup-form">
        {!otpSent ? (
          <>
            <BlockbusterText>Sign Up for BlogBuster</BlockbusterText>
            <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
              <CustomInput prefix={<UserOutlined style={{ color: '#8B4513' }} />} placeholder="Username" onChange={handleChange} name="username" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
              <CustomInput prefix={<MailOutlined style={{ color: '#8B4513' }} />} placeholder="Email" onChange={handleChange} name="email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <CustomPasswordInput prefix={<LockOutlined style={{ color: '#8B4513' }} />} placeholder="Password" onChange={handleChange} name="password" />
            </Form.Item>
            <Form.Item>
              <SignupButton type="primary" htmlType="button" onClick={handleSignup} block>
                SignUp
              </SignupButton>
            </Form.Item>
          </>
        ) : (
          <>
            <BlockbusterText>Verify OTP</BlockbusterText>
            <Form.Item name="otp" rules={[{ required: true, message: 'Please input the OTP sent to your email!' }]}>
              <CustomInput prefix={<LockOutlined style={{ color: '#8B4513' }} />} placeholder="OTP" onChange={handleChange} name="otp" />
            </Form.Item>
            <Form.Item>
              <SignupButton type="primary" htmlType="button" onClick={handleOTPVerification} block>
                Verify OTP
              </SignupButton>
            </Form.Item>
          </>
        )}
        <Form.Item>
          <p>
            Already have an account? <StyledLink to="/login">Sign in</StyledLink>
          </p>
        </Form.Item>
      </SignupForm>
    </SignupContainer>
  );
};

export default Signup;
