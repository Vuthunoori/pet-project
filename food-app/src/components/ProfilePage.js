import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Form, Input, Layout } from 'antd';
import { Grid, Menu, theme } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import CartModal from './Cart.js';
import { CustomerServiceOutlined } from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';
import { Avatar,notification} from 'antd';
import { UserOutlined } from '@ant-design/icons';



const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js',
    '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js',
  ],
});

const {  Content, Footer } = Layout;
const { useToken } = theme;
const { useBreakpoint } = Grid;

const ProfilePage = () => {
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();

  const menuItems = [
    { label: <span style={{ color: 'white' }}>Home</span>, key: "home" },
    // { label: <span style={{ color: 'white' }}>Payment</span>, key: "Payment" },
  ];

  const [current, setCurrent] = useState("projects");

  const onClick = (e) => {
    setCurrent(e.key);
    switch (e.key) {
      case "home":
        navigate("/");
        break;
      // case "Payment":
      //   navigate("/pay");
      //   break;
      default:
        break;
    }
  };

  const styles = {
    header: {
      backgroundColor: token.colorBgContainer,
      borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
      height: "60px",
      padding: "0 20px",
      position: "relative",
      backgroundColor:"#001529",
    },
    menu: {
      backgroundColor: "transparent",
      borderBottom: "none",
      lineHeight: screens.sm ? "4rem" : "3.5rem",
      marginLeft: screens.md ? "0px" : `-${token.size}px`,
      width: screens.md ? "inherit" : token.sizeXXL,
      fontSize: '1.5rem',
    },
    menuContainer: {
      alignItems: "center",
      display: "flex",
      gap: token.size,
      justifyContent: 'space-between',
      width: "100%",
      height: "50px",
      color:"white",
      
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '25px',
      marginTop: "5px",
    },
    content: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh', // Adjust the minimum height to center vertically
    },
    card: {
      width: '100%',
      maxWidth: 600, // Limit the maximum width of the card
      padding: 20,
      height:700,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError('Failed to fetch session.');
        return;
      }
      setSession(data.session);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const userId = session.user.id;
          const response = await axios.get(`http://localhost:4000/users/${userId}`);
          setUserData(response.data);
          setLoading(false);
        } catch (err) {
          // setError('Failed to load user data.');
          notification.error({
            message:'Error loading user data',
            description:'There was an issue when fetching user data.Please try again later',
          });
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [session]);

  const handleSubmit = async () => {
    try {
      const userId = session.user.id;
      await axios.put(`http://localhost:4000/users/${userId}`, userData);
      // alert('Profile updated successfully!');
      notification.success({
        message: 'Profile Updated',
        description: 'Your profile has been updated successfully!',
        placement:'top',
      });
    } catch (err) {
      // setError('Failed to update profile.');
      notification.error({
        message:'Error updating profile',
        description:'There was an issue when updating profile.Please try again later',
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;

  const handleSignOut = async () => {
    try {
      const userId = session.user.id;
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        alert('Failed to sign out. Please try again.');
        return;
      }
      if (userId) {
        await axios.delete(`http://localhost:4000/users/${userId}`);
      }
      navigate('/');
    } catch (error) {
      console.error('Error during sign-out:', error.message);
      // alert('An unexpected error occurred. Please try again.');
      notification.error({
        message:'Error signing out',
        description:'There was an issue when signing out.Please try again later',
      });
    }
  };

  const handleCloseCartModal = () => {
    setIsCartModalVisible(false);
  };
  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page when the icon is clicked
  };
 
  return (
    <Layout className="layouts">
    
      <nav style={styles.header}>
     
        <div style={styles.menuContainer}>
        <Avatar size="large" style={{  fontSize: "30px"  }}  onClick={handleProfileClick} icon={<UserOutlined />} />
          <Menu
            style={styles.menu}
            mode="horizontal"
            items={menuItems}
            onClick={onClick}
            selectedKeys={screens.md ? [current] : ""}
            overflowedIndicator={<Button type="text" icon={<MenuOutlined />} />}
          />
          <div style={styles.iconContainer}>
            <IconFont type="icon-shoppingcart" onClick={() => setIsCartModalVisible(true)} style={{ fontSize: "40px" }} />
            <CustomerServiceOutlined style={{ fontSize: "38px" }} onClick={() => { navigate('/order') }} />
            <Button className="header-button sign-out" type="primary" onClick={handleSignOut} style={{ marginBottom: "40px" }}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>
     
      <Content className="contents" style={styles.content}>
      
      <Card
  style={styles.card}
  title={<span style={{ fontSize: '30px', fontWeight: 'bold' ,marginLeft:"165px"}}>User Profile</span>}
>
          <Form
            onFinish={handleSubmit}
            initialValues={{
              name: userData.name,
              email: userData.email,
            }}
          >
            <Form.Item name="name" label={<span style={{ fontSize: '20px' }}>Name</span>}>
              <Input style={{fontSize:"21px"}}
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="email"  label={<span style={{ fontSize: '20px' }}>Email</span>} rules={[{ type: 'email' }]}>
              <Input value={userData.email} readOnly style={{fontSize:"21px"}} />
            </Form.Item>
            <Form.Item>
              <Button style={{ marginTop: "400px" ,fontSize:"32px", marginLeft:"137px", height:"40px",width:"250px"}} type="primary" htmlType="submit">
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
      <Footer className="foot">Footer Content</Footer>
      <CartModal visible={isCartModalVisible} onClose={handleCloseCartModal} />
    </Layout>
  );
};

export default ProfilePage;
