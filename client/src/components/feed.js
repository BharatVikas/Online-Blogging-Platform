import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Card, Space, Button, message, Spin, Input, Dropdown, Menu, Layout, Typography, Tooltip, Modal, Image } from 'antd';
import { LikeOutlined, DislikeOutlined, MessageOutlined, ShareAltOutlined, DownOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NavBar from './navbar';

const { Search } = Input;
const { Content } = Layout;
const { Title } = Typography;

const BlogFeed = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();

  const fetchBlogFeed = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:8081/api/feed';
      const params = {};
      if (sortBy) params.sortBy = sortBy;
      if (searchQuery) params.search = searchQuery;
      const response = await axios.get(url, { params });
      setBlogPosts(response.data.map(post => ({
        ...post,
        image: `https://source.unsplash.com/featured/?${encodeURIComponent(post.title)}`,
      })));
    } catch (error) {
      console.error('Error fetching blog feed:', error);
      message.error('Failed to fetch blog feed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogFeed();
  }, [sortBy, searchQuery, postId]);

  const handleLike = async (postId) => {
    // Handle like logic
  };

  const handleDislike = async (postId) => {
    // Handle dislike logic
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  return (
    <Layout>
      <NavBar />
      <Content style={{ padding: '24px' }}>
          <center><Title level={100} style={{ marginBottom: '24px' }}>Blog Feed</Title></center>
        <Space style={{ marginBottom: '16px' }}>
          <Search placeholder="Search posts" onSearch={value => setSearchQuery(value)} enterButton />
          <Dropdown overlay={
            <Menu onClick={({ key }) => setSortBy(key)}>
              <Menu.Item key="date">Sort by Date</Menu.Item>
              <Menu.Item key="likes">Sort by Likes</Menu.Item>
            </Menu>
          }>
            <Button>
              Sort By <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={blogPosts}
          loadMore={<Spin spinning={loading} />}
          renderItem={(post) => (
            <List.Item key={post._id}>
              <Card
                hoverable
                cover={<Image alt="post" src={post.image} onClick={() => handlePostClick(post)} />}
                actions={[
                  <Space key="actions">
                    <Tooltip title={'Like'}>
                      <Button icon={<LikeOutlined />} onClick={() => handleLike(post._id)}>
                        {post.likes}
                      </Button>
                    </Tooltip>
                    <Tooltip title={'Dislike'}>
                      <Button icon={<DislikeOutlined />} onClick={() => handleDislike(post._id)}>
                        {post.dislikes}
                      </Button>
                    </Tooltip>
                    <Button icon={<MessageOutlined />} onClick={() => navigate(`/blog/${post._id}`)}>
                      Comment
                    </Button>
                    <Button icon={<ShareAltOutlined />}>
                      Share
                    </Button>
                  </Space>
                ]}
              >
                <Card.Meta
                  title={<Link to={`/blog/${post._id}`}>{post.title}</Link>}
                  description={
                    <>
                      <p>By: {post.author ? post.author.username : 'Unknown'}</p>
                      <p>{post.content}</p>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
        <Modal
          visible={selectedPost !== null}
          title={selectedPost?.title}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" onClick={handleCloseModal}>
              Close
            </Button>
          ]}
        >
          <Image src={selectedPost?.media} alt="post" />
        </Modal>
      </Content>
    </Layout>
  );
};

export default BlogFeed;
