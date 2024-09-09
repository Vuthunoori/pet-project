import React, { useEffect, useState } from "react";

import { Layout } from "antd";
import {  useNavigate } from 'react-router-dom';
import { Button, Card, Grid, Menu,theme } from "antd";
import CartModal from './Cart.js'; 

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
const { useToken } = theme;
const { useBreakpoint } = Grid;




const OrderHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);

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
    { label: "Payment", key: "payment" },
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
          case "payment":
            navigate("/pay");
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

  useEffect(() => {
    // Fetch orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orderDetails"));
    
    if (storedOrders) {
      setOrderHistory([storedOrders]); // If you expect multiple orders, adjust this accordingly
    }
  }, []);
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
      <Header className="headers">Order History</Header>
      <Content className="contents">
        <h2>Your Order History</h2>
        {orderHistory.length === 0 ? (
          <p>Your order history is empty.</p>
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
