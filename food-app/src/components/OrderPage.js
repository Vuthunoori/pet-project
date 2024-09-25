import React, { useEffect, useState } from "react";
import { supabase } from './supabaseClient';
import { Layout } from "antd";
import {  useNavigate } from 'react-router-dom';
import { Button, Card, Grid, Menu,theme,notification } from "antd";
import CartModal from './Cart.js'; 
import { useRecoilValue} from 'recoil';
import { useRecoilState} from 'recoil';
import { MenuOutlined } from "@ant-design/icons";
// import { currentRestaurantState } from '../atoms/cartstate.js';
import { cartState } from "../atoms/cartstate.js";
import { Avatar} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CustomerServiceOutlined } from '@ant-design/icons';
import axios from 'axios';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js',
    // icon-javascript, icon-java, icon-shoppingcart (overridden)
    '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
  ],
});
const { Header, Content, Footer } = Layout;
const { useToken } = theme;
const { useBreakpoint } = Grid;




const OrderHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [session, setSession] = useState(null);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  // const [currentRestaurant, setCurrentRestaurant] = useRecoilValue(currentRestaurantState);
  // const [cart, setCart] = useRecoilState(cartState);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [carts, setCarts]=useRecoilState(cartState);
  const { token } = useToken();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { Meta } = Card;
  const menuItems = [
    
    {
      label: <span style={{ color: 'white' }}>Home</span>,
      key: "home",
    },
    // { label: <span style={{ color: 'white' }}>Menu</span>, key: "menu" },
    // { label: "Cart", key: "cart" },
    // { label: <span style={{ color: 'white' }}>Payment</span>, key: "Payment" },
    // { label: "Order Status", key: "order-status" },
  ];

  const [current, setCurrent] = useState("projects");

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    switch (e.key) {
      
      case "home":
        navigate("/");
        break;
        // case "menu":
        //   navigate(`/restaurant/${currentRestaurant}`);
        //   break;
      // case "cart":
      //   setIsCartModalVisible(true);
      //   break;
      // case "Payment":
      //   navigate("/pay");
      //   break;
        // case "order-status":
        //   navigate("/order");
        //   break;
     
      
      default:
        break;
    }
  };

  const styles = {
 
    header: {
      backgroundColor: token.colorBgContainer,
      borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
      height: "60px", // Adjust the height here
      backgroundColor:"#001529",
     
    padding: "0 20px",
      position: "relative",
    },
    menu: {
      backgroundColor: "transparent",
      borderBottom: "none",
      lineHeight: screens.sm ? "4rem" : "3.5rem",
      marginLeft: screens.md ? "0px" : `-${token.size}px`,
      width: screens.md ? "inherit" : token.sizeXXL,
      fontSize: '1.5rem'
      
    },
    menuContainer: {
      alignItems: "center",
      display: "flex",
      gap: token.size,
      justifyContent: 'space-between', 
      width: "100%",
      height:"50px",
      color:"white",
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '23px', // Adjust the gap between the icons
      marginTop:"5px",
    },
  };
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log('Failed to fetch session.');
        return;
      }
      setSession(data.session);
    };
  
    fetchSession();
    setCarts([]);
  }, []);
  useEffect(() => {

    const fetching= async()=>{
       try{
          const response= await axios.get('http://localhost:4000/orders');
          
          if(response){
          setOrderHistory(response.data);
          }
       }
       catch (error) {
        console.error("There was an error", error);
        notification.error({
          message:'Error Fetching Order Details',
          description:'There was an issue fetching order details.Please try again later',
        });
        
      }
      
    }
   
    // const storedOrders = JSON.parse(localStorage.getItem("orderDetails"));
    
    // if (storedOrders) {
    //   setOrderHistory([storedOrders]); // If you expect multiple orders, adjust this accordingly
    // }
    fetching();
    
  }, []);
 
  
  const handleCloseCartModal = () => {
    setIsCartModalVisible(false);
  };
  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page when the icon is clicked
  };
  const handleSignOut = async () => {
    try {
      // Get the user ID from Supabase session
      const userId = session.user.id;
  console.log(`signout`,userId);
      // Sign out the user
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        alert('Failed to sign out. Please try again.');
        return;
      }
  
      // Delete user data from the backend
      if (userId) {
        await axios.delete(`http://localhost:4000/users/${userId}`);
      }
  
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error('Error during sign-out:', error.message);
      notification.error({
        message:'Error signing out',
        description:'There was an issue when signing out.Please try again later',
      });
    }
  };
  return (
    <Layout className="layouts">
         <nav style={styles.header}>
     
     <div style={styles.menuContainer}>
     
       <Menu
         style={styles.menu}
         mode="horizontal"
         items={menuItems}
         onClick={onClick}
         selectedKeys={screens.md ? [current] : ""}
         overflowedIndicator={
           <Button type="text" icon={<MenuOutlined />} />
         }
       />
          <div style={styles.iconContainer}>
       <Avatar size="large" style={{  fontSize: "35px"  }}  onClick={handleProfileClick} icon={<UserOutlined />} />
      <IconFont type="icon-shoppingcart" onClick={() => setIsCartModalVisible(true)} style={{  fontSize: "40px" }} />
      <CustomerServiceOutlined  style={{  fontSize: "38px"}} onClick={()=>{navigate('/order')}}/>
      <Button className="header-button sign-out" type="primary" onClick={handleSignOut} style={{  marginBottom: "40px"}}  >
         Sign Out
       </Button>
      </div>
   </div>
   
 </nav>
     
      <Content className="contents">
        <h2 style={{fontSize:"30px"}}>Your Order History</h2>
        {orderHistory.length === 0 ? (
          <p style={{fontSize:"35px",marginLeft:"700px",marginTop:"300px"}}>Your order history is empty.</p>
        ) : (
          <div>
            {orderHistory.map((order, index) => (
              <Card
                key={index}
                title={`Order #${index + 1}`}
                style={{ marginBottom: "20px" }}
              >
                {order.cartItems.map((item, idx) => (
                  <Meta
                    key={idx}
                    title={<h3>{item.name}</h3>}
                    description={
                      <div>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    }
                  />
                ))}
              
              </Card>
            ))}
          </div>
        )}
      </Content>
      <Footer className="foot">Footer Content</Footer>
      <CartModal visible={isCartModalVisible} onClose={handleCloseCartModal} />
    </Layout>
  );
};

export default OrderHistoryPage;
