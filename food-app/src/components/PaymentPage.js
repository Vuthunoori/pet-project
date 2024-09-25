
import React, { useState, useEffect } from "react";
import {  useNavigate } from 'react-router-dom';
import { Button, Card, Grid, Menu,theme } from "antd";
import CartModal from './Cart.js'; 
import axios from 'axios';
import { MenuOutlined } from "@ant-design/icons";
import { supabase } from './supabaseClient';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cartState,currentRestaurantState } from '../atoms/cartstate.js';

import { Layout ,notification } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { Avatar} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CustomerServiceOutlined } from '@ant-design/icons';
import AddressModal from "./addressmodal.js";


// const usersApiUrl = 'http://localhost:4000/orders';
const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js',
    // icon-javascript, icon-java, icon-shoppingcart (overridden)
    '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
  ],
});
const {  Content, Footer } = Layout;
const { useToken } = theme;
const { useBreakpoint } = Grid;

const PaymentPage = () => {
  const cartItems = useRecoilValue(cartState);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible]=useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useRecoilState(currentRestaurantState);
  console.log(`curr`,currentRestaurant);
  const [session, setSession] = useState(null);
  const { token } = useToken();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { Meta } = Card;
  
  
  const menuItems = [
    
    {
      label: <span style={{ color: 'white' }}>Home</span>,
      key: "home",
    },
    // { label: <span style={{ color: 'white' }}>Menu</span>,
    //   key: "menu" },
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
        // case "menu":
        // navigate(`/restaurant/${currentRestaurant}`);
        // break;
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
  const itemTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const gst = itemTotal * 0.10; // Assume 10% GST
  const deliveryCharge = 5.00; 
  const totalAmount = itemTotal + gst + deliveryCharge;
  console.log('render');
  // Dummy function to handle payment
  
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

 
//   const handlePayment = async() => {
   
//       const orderDetails = {
//         id:session.user.id,
//         cartItems
//         // itemTotal: itemTotal.toFixed(2),
//         // gst: gst.toFixed(2),
//         // deliveryCharge: deliveryCharge.toFixed(2),
//         // totalAmount: totalAmount.toFixed(2)
//       };
      
//   //     // Store the order details in local storage
//   //     localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
//   // navigate('/order');
//   try {
//     // Post order details to the JSON server
//     console.log('posting');
//     const response= await axios.post('http://localhost:4000/orders', orderDetails);
// console.log(response);
//      if(response)
//       {
//          navigate('/order');
//        }

 
   
//   } catch (error) {
//     console.error("There was an error making the payment!", error);
    
//   }
 
//  // Adjust delay as needed
// };
  
   
    // Redirect or handle payment confirmation
    const handleCloseCartModal = () => {
      setIsCartModalVisible(false);
    };
    const handleCloseAddressModal=()=>{
      setIsAddressModalVisible(false);
    }
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
     
 
     {/* <div style={styles.menuContainer}>
    
       {/* Remove the logo */}
       {/* <Menu
         style={styles.menu}
         mode="horizontal"
         items={menuItems}
         onClick={onClick}
         selectedKeys={screens.md ? [current] : ""}
         overflowedIndicator={
           <Button type="text" icon={<MenuOutlined />} />
         }
       /> */} 
       
       {/* <div style={styles.iconContainer}>
       <Avatar size="large" style={{  fontSize: "35px"  }}  onClick={handleProfileClick} icon={<UserOutlined />} />
      <IconFont type="icon-shoppingcart" onClick={() => setIsCartModalVisible(true)} style={{  fontSize: "40px" }} />
      <CustomerServiceOutlined  style={{  fontSize: "38px"}} onClick={()=>{navigate('/order')}}/>
      <Button className="header-button sign-out" type="primary" onClick={handleSignOut} style={{  marginBottom: "40px"}}  >
         Sign Out
       </Button>
      </div>
   </div> */}
  

      <Content className="contents">
        <h2 style={{fontSize:"30px"}} >Your Order</h2>
        {cartItems.length === 0 ? (
          <p style={{fontSize:"30px"}}>Your cart is empty.</p>
        ) : (
          <div>
            
              {cartItems.map((item, index) => (
                <Card
                key={index} style={{ marginBottom: '20px' }}>
                    <Meta
                  title={<h3 style={{ marginBottom: '0px' }}>{item.name}</h3>}
                  description={
                    <div>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  </div>
                  }
                />
                 </Card>
              ))}
             
             <div>
              <h3>Item Total: ${itemTotal.toFixed(2)}</h3>
              <p>GST (10%): ${gst.toFixed(2)}</p>
              <p>Delivery Charge: ${deliveryCharge.toFixed(2)}</p>
              <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
            </div>
          </div>
        )}
        {cartItems.length > 0 && (
        <>
          {/* <Button type="primary" onClick={handlePayment}>
            Confirm Payment
          </Button> */}
           <Button type="primary" onClick={() => setIsAddressModalVisible(true)}>
           Confirm Payment
         </Button>
        </>
      )}
     
      
      </Content>
      <Footer className="foot">Footer Content</Footer>
      <CartModal visible={isCartModalVisible} onClose={handleCloseCartModal} />
      <AddressModal visible={isAddressModalVisible} onClose={handleCloseAddressModal}  userId={session?.user.id} />
    </Layout>
    
  );
};

export default PaymentPage;
