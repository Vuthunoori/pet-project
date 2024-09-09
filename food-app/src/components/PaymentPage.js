
import React, { useState } from "react";
import {  useNavigate } from 'react-router-dom';
import { Button, Card, Grid, Menu,theme } from "antd";
import CartModal from './Cart.js'; 

import { MenuOutlined } from "@ant-design/icons";

import { useRecoilValue } from 'recoil';
import { cartState } from '../atoms/cartstate.js';
import { Layout } from 'antd';
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

const PaymentPage = () => {
  const cartItems = useRecoilValue(cartState);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const { token } = useToken();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { Meta } = Card;

  const menuItems = [
    
    {
      label: "Dashboard",
      key: "dashboard",
    },
    { label: "Cart", key: "cart" },
    { label: "Order Status", key: "order-status" },
  ];

  const [current, setCurrent] = useState("projects");

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    switch (e.key) {
      
      case "dashboard":
        navigate("/dashboard");
        break;
        case "cart":
          setIsCartModalVisible(true);
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


  const itemTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const gst = itemTotal * 0.10; // Assume 10% GST
  const deliveryCharge = 5.00; 
  const totalAmount = itemTotal + gst + deliveryCharge;

  // Dummy function to handle payment
  const handlePayment = () => {
  
      const orderDetails = {
        cartItems,
        itemTotal: itemTotal.toFixed(2),
        gst: gst.toFixed(2),
        deliveryCharge: deliveryCharge.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
      };
  
      // Store the order details in local storage
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
  navigate('/order');
  
      // Redirect or handle payment confirmation
    
    };
   
    // Redirect or handle payment confirmation
    const handleCloseCartModal = () => {
      setIsCartModalVisible(false);
    };

  return (
    <Layout className="layouts">
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
     <IconFont type="icon-shoppingcart" onClick={() => setIsCartModalVisible(true)} style={{ margin: "10px 30px", fontSize: "40px" }} /> 
   </div>
  
 </nav>
      <Header className="headers">Payment</Header>
      <Content className="contents">
        <h2>Your Order</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
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
          <Button type="primary" onClick={handlePayment}>
            Confirm Payment
          </Button>
        )}
      </Content>
      <Footer className="foot">Footer Content</Footer>
      <CartModal visible={isCartModalVisible} onClose={handleCloseCartModal} />
    </Layout>
    
  );
};

export default PaymentPage;
