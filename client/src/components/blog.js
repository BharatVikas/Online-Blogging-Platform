import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Input, Button, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import NavBar from './navbar';
import ReactQuill from 'react-quill';
import styled from 'styled-components';


const { Dragger } = Upload;

const FullPageContainer = styled.div`
  min-height: 100vh;
  background-color: black; /* Set background color to black */
  color: white; /* Set text color to white */
`;

const BlogContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 20px;
`;

const BlogTitle = styled.h1`
  font-size: 36px;
  margin: 20px 0;
  text-align: center; /* Center align the text */
  text-shadow: 0 0 10px cyan; /* Add neon lighting effect */
`;

const BlogInput = styled(Input)`
  margin-bottom: 10px;
`;

const StyledQuill = styled(ReactQuill)`
  margin-bottom: 10px;
  .ql-editor {
    color: white; /* Set typing area text color to white */
  }
`;

const SelectPrivacy = styled.select`
  margin-bottom: 10px;
  width: 100%;
`;

const UploadContainer = styled(Dragger)`
  margin-bottom: 10px;
  width: 100%;

  .ant-upload-drag-icon {
    font-size: 24px;
    color: #8B4513;
  }

  .ant-upload-text {
    color: #8B4513;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  max-width: 200px;
  background-color: #8B4513;
  border-color: #8B4513;
`;

const BlogPage = () => {
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    tags: '',
    privacy: 'public',
    media: null,
  });

  const handleMediaUpload = (file) => {
    setBlogData({ ...blogData, media: file });
    message.success(`${file.name} uploaded successfully.`);
  };

  const handleBlogSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      const plainTextContent = new DOMParser().parseFromString(blogData.content, 'text/html').documentElement.textContent;
      formData.append('content', plainTextContent);
      formData.append('tags', blogData.tags);
      formData.append('privacy', blogData.privacy);
      formData.append('author', 'Replace with actual author');

      if (blogData.media) {
        formData.append('media', blogData.media.originFileObj);
      }

      await axios.post('http://localhost:8081/api/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Blog post submitted successfully', 0.6);
    } catch (error) {
      console.error('Error submitting blog post:', error);
      message.error('Failed to submit blog post. Please try again.', 0.6);
    }
  };

  return (
    <FullPageContainer>
      <NavBar />
      <BlogContainer>
        <BlogTitle>Create a New Blog</BlogTitle>

        <BlogInput
          placeholder="Enter blog title"
          value={blogData.title}
          onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
        />

        <StyledQuill
          value={blogData.content}
          onChange={(content) => setBlogData({ ...blogData, content })}
        />

        <BlogInput
          placeholder="Enter tags (comma-separated)"
          value={blogData.tags}
          onChange={(e) => setBlogData({ ...blogData, tags: e.target.value })}
        />

        <SelectPrivacy
          value={blogData.privacy}
          onChange={(e) => setBlogData({ ...blogData, privacy: e.target.value })}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </SelectPrivacy>

        <UploadContainer
          beforeUpload={() => false}
          showUploadList={false}
          onChange={(info) => handleMediaUpload(info.file)}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag media file to this area to upload</p>
        </UploadContainer>

        <SubmitButton type="primary" onClick={handleBlogSubmit}>
          Submit Blog
        </SubmitButton>
      </BlogContainer>
    </FullPageContainer>
  );
};

export default BlogPage;
