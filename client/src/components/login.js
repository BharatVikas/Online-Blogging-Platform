import React from 'react';
import { Form, Input, Button, Checkbox, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import backgroundImage from './obsbg2.jpg';
import axios from 'axios';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url(${backgroundImage}) center/cover no-repeat;
`;

const LoginForm = styled(Form)`
  max-width: 400px;
  width: 100%;
  padding: 30px;
  background: #d2b48c;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
    transform: scale(1.02);
  }
`;

const CustomCheckbox = styled(Checkbox)`
  margin-left: 8px;
`;

const LoginButton = styled(Button)`
  position: relative;
  background-color: #8B4513;
  border-color: #8B4513;
  color: #fff;
  font-weight: bold;
  overflow: hidden;

  &:hover {
    background-color: #A0522D;
    border-color: #A0522D;
  }

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 2px solid #00ff00;
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const SignUpLink = styled(Link)`
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
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.8);
`;

const StyledInput = styled(Input)`
  height: 48px;
`;

const StyledPasswordInput = styled(Input.Password)`
  height: 48px;
`;

const Login = () => {
  const navigate = useNavigate();

  const openNotification = (type, message) => {
    notification[type]({
      message: 'Login Attempt',
      description: message,
      placement: 'top',
      duration: 3,
    });
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post('https://online-blogging-platform-vafr.vercel.app/login', values, { withCredentials: true });
      console.log(response);
      navigate('/home');
      openNotification('success', 'You have successfully logged in!');
    } catch (error) {
      console.error('Login failed:', error.message);
      if (error.response) {
        console.log(error.response.data);
        openNotification('error', 'Invalid credentials. Please try again.');
      } else {
        openNotification('error', 'Login failed. Please try again later.');
      }
    }
  };

  return (
    <LoginContainer>
      <LoginForm
        name="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <BlockbusterText>Login to BlogBuster</BlockbusterText>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <StyledInput
            prefix={<UserOutlined style={{ color: '#8B4513' }} />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <StyledPasswordInput
            prefix={<LockOutlined style={{ color: '#8B4513' }} />}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <CustomCheckbox>Remember me</CustomCheckbox>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <LoginButton type="primary" htmlType="submit" block>
            LogIn
          </LoginButton>
        </Form.Item>
        <Form.Item>
          <p>
            Don't have an account? <SignUpLink to="/signup">Click here to sign up</SignUpLink>
          </p>
        </Form.Item>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
