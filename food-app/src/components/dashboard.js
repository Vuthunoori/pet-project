import React, { useState } from "react";
import { supabase } from './supabaseClient';
import { Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import RestaurantListings from './RestaurantListings.js'; 
import './layoutstyle.css';
import CartModal from './Cart.js'; 
import {  Grid, Menu,theme } from "antd";

import { MenuOutlined } from "@ant-design/icons";
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js',
    // icon-javascript, icon-java, icon-shoppingcart (overridden)
    '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
  ],
});
const { Header, Content, Footer } = Layout;


function Dashboard() {
  const { useToken } = theme;
const { useBreakpoint } = Grid;
 const navigate = useNavigate();
 const { token } = useToken();
 const screens = useBreakpoint();
 const [isCartModalVisible, setIsCartModalVisible] = useState(false);

 const menuItems = [
   
  
   { label: "Cart", key: "cart" },
   { label: "Payment", key: "payment" },
   { label: "Order Status", key: "order-status" },
 ];

 const [current, setCurrent] = useState("projects");

 const onClick = (e) => {
   console.log("click ", e);
   setCurrent(e.key);
   switch (e.key) {
     
    
    case "cart":
      setIsCartModalVisible(true);
      break;
      case "payment":
        navigate("/pay");
        break;
     
     case "order-status":
       navigate("/order");
       break;
    
     
     default:
       break;
   }
 };

 const styles = {

   header: {
     backgroundColor: token.colorBgContainer,
     borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
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
     width: "100%",
   },
 };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        alert('Failed to sign out. Please try again.');
      
      } else {
        
        navigate('/'); 
      }
    } catch (error) {
      console.error('Error during sign-out:', error.message);
      alert('An unexpected error occurred. Please try again.');
    }
  };
  const handleCloseCartModal = () => {
    setIsCartModalVisible(false);
  };

  return (
    <Layout className="layout">
   
    <Header className="header">
      <div className="header-title">Dashboard</div>
      <div>
      <IconFont type="icon-shoppingcart" onClick={() => setIsCartModalVisible(true)} style={{ margin: "50px 30px", fontSize: "40px" }} />
          <Button className="header-button sign-out" type="primary" onClick={handleSignOut}  >
            Sign Out
          </Button>
        </div>
      
    </Header>
    <nav style={styles.header}>
     
     <div style={styles.menuContainer}>
       {/* Remove the logo */}
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
     
   </div>
 </nav>  
    <Content className="content">
      <RestaurantListings />
    </Content>
    <Footer className="footer">
      Footer Content
    </Footer>
    <CartModal visible={isCartModalVisible} onClose={handleCloseCartModal} />
  </Layout>
);
}

export default Dashboard;
