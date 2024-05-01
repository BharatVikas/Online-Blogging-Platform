import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Upload, Avatar, Modal } from 'antd';
import { UserOutlined, SaveOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import NavBar from './navbar';
import { useAuth } from './AuthContext'; // Import useAuth hook

const ProfileContainer = styled.div`
  max-width: 400px;
  margin: auto;
  padding: 20px;
`;

const ProfileForm = styled(Form)`
  width: 100%;
`;

const StyledInput = styled(Input)`
  margin-bottom: 16px;
`;

const SaveButton = styled(Button)`
  background-color: #8B4513;
  border-color: #8B4513;
  color: #fff;
  font-weight: bold;

  &:hover {
    background-color: #A0522D;
    border-color: #A0522D;
  }
`;

const DeleteButton = styled(Button)`
  margin-top: 16px;
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
  font-weight: bold;

  &:hover {
    background-color: #ff7875;
    border-color: #ff7875;
  }
`;

const Profile = () => {
  const { user, logout } = useAuth(); // Get logged-in user and logout function from AuthContext
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const openNotification = (type, message) => {
    notification[type]({
      message: 'Notification',
      description: message,
    });
  };

  useEffect(() => {
    form.setFieldsValue(user); // Autofill form fields with logged-in user's details
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`http://localhost:8081/profile/${user.id}`, { ...values, avatar });
      setIsEditing(false);
      openNotification('success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Profile save failed:', error.message);
      openNotification('error', 'Failed to save profile. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8081/profile/${user.id}`);
      logout(); // Logout user after deleting account
      openNotification('success', 'Account deleted successfully!');
    } catch (error) {
      console.error('Account deletion failed:', error.message);
      openNotification('error', 'Failed to delete account. Please try again.');
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      setAvatar(info.file.originFileObj);
    }
  };

  return (
    <div>
      <NavBar />
      <ProfileContainer>
        <h2>{isEditing ? 'Edit Profile' : 'User Profile'}</h2>
        <ProfileForm form={form} initialValues={user} onFinish={handleSave}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <StyledInput prefix={<UserOutlined />} placeholder="Username" readOnly={!isEditing} />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <StyledInput prefix={<UserOutlined />} placeholder="Email" readOnly={!isEditing} />
          </Form.Item>
          <Form.Item label="Profile Photo">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              onChange={handleAvatarChange}
            >
              {avatar ? (
                <Avatar src={URL.createObjectURL(avatar)} alt="Avatar" />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          {isEditing && (
            <Form.Item>
              <SaveButton type="primary" htmlType="submit" block icon={<SaveOutlined />}>
                Save Profile
              </SaveButton>
            </Form.Item>
          )}
        </ProfileForm>
        {!isEditing && (
          <>
            <Button type="primary" onClick={handleEdit} block>
              Edit Profile
            </Button>
            <DeleteButton type="primary" onClick={() => setDeleteModalVisible(true)} block icon={<DeleteOutlined />}>
              Delete Account
            </DeleteButton>
          </>
        )}
        <Modal
          title="Confirm Account Deletion"
          visible={deleteModalVisible}
          onOk={handleDeleteConfirm}
          onCancel={() => setDeleteModalVisible(false)}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelButtonProps={{ type: 'default' }}
        >
          Are you sure you want to delete your account? This action cannot be undone.
        </Modal>
      </ProfileContainer>
    </div>
  );
};

export default Profile;
