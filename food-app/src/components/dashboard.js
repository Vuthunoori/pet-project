import React, { useState ,useEffect} from "react";
import { supabase } from './supabaseClient';
import { Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import RestaurantListings from './RestaurantListings.js'; 
import './layoutstyle.css';
import CartModal from './Cart.js'; 
import  axios from 'axios';
import {  Grid, Menu,theme } from "antd";

import { MenuOutlined } from "@ant-design/icons";
import { UserOutlined } from '@ant-design/icons';
import { Avatar} from 'antd';

import { CustomerServiceOutlined } from '@ant-design/icons';
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
 const [session, setSession] = useState(null);
//  const menuItems = [
   
  
//    { label: "Cart", key: "cart" },
//    { label: "Payment", key: "payment" },
//    { label: "Order Status", key: "order-status" },
//  ];

//  const [current, setCurrent] = useState("projects");
 

//  const onClick = (e) => {
//    console.log("click ", e);
//    setCurrent(e.key);
//    switch (e.key) {
     
    
//     case "cart":
//       setIsCartModalVisible(true);
//       break;
//       case "payment":
//         navigate("/pay");
//         break;
     
//      case "order-status":
//        navigate("/order");
//        break;
    
     
//      default:
//        break;
//    }
//  };
const menuItems = [
    
  {
    label: <span style={{ color: 'white' }}>Home</span>,
    key: "home",
  },
 
  // { label: "Cart", key: "cart" },
  // { label:<span style={{ color: 'white' }}>Payment</span>, key: "payment" },
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
    
    // case "cart":
    //   setIsCartModalVisible(true);
    //   break;
    // case "payment":
    //   navigate("/pay");
    //   break;
      // case "order-status":
      //   navigate("/order");
      //   break;
   
    
    default:
      break;
  }
};

//  const styles = {

//    header: {
//      backgroundColor: token.colorBgContainer,
//      borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
//      position: "relative",
//    },
//    menu: {
//      backgroundColor: "transparent",
//      borderBottom: "none",
//      lineHeight: screens.sm ? "4rem" : "3.5rem",
//      marginLeft: screens.md ? "0px" : `-${token.size}px`,
//      width: screens.md ? "inherit" : token.sizeXXL,
//      fontSize: '1.5rem'
//    },
//    menuContainer: {
//      alignItems: "center",
//      display: "flex",
//      gap: token.size,
//      width: "100%",
//    },
//  };
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
    fontSize: '1.7rem',
    //color:"white",
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
    gap: '26px', // Adjust the gap between the icons
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
}, []);

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
    alert('An unexpected error occurred. Please try again.');
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
   
     <Menu
       style={styles.menu }
     
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
    {/* <nav style={styles.header}>
     
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
     
   </div>
 </nav>   */}
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
