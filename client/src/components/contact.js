import React from 'react';
import { Layout, Typography, Input, Form, Button, message, Row, Col } from 'antd';
import NavBar from './navbar'; // Import the NavBar component

const { Content } = Layout;
const { Title, Text } = Typography;

const Contact = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    message.success('Thank you for contacting us! We will get back to you soon.');
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields.');
  };

  return (
    <Layout>
      {/* NavBar */}
      <NavBar />

      <Content style={{ padding: '50px 0px 0px' }}>
        <Layout className="layout">
          <Content style={{ padding: '0 50px' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2}>Contact Us</Title>
              <Text>
                If you have any questions or inquiries, feel free to contact us using the fo  rm below.
              </Text>
            </div>
            {/* Contact Form */}
            <Form
              form={form}
              name="contact"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              style={{ marginTop: '20px' }}
              layout="vertical"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                  >
                    <Input placeholder="Enter your name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true, message: 'Please input your message!' }]}
              >
                <Input.TextArea placeholder="Enter your message" rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default Contact;
