// components/RestaurantDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { cartState } from '../atoms/cartstate.js';
import {  Input } from 'antd';
import { Switch ,Card } from 'antd';
import CartModal from './Cart.js';



import { Button, Grid, Menu, theme } from "antd";

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
const { Meta } = Card;

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [cart, setCart] = useRecoilState(cartState); // Use Recoil for cart state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [isVeg, setIsVeg] = useState(false); 
  const [isNonVeg, setIsNonVeg] = useState(false); // Initial state set to Non-Veg
  const [reviews, setReviews] = useState([]);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  useEffect(() => {
    if(!currentRestaurant)setCart([]);
    if (currentRestaurant && currentRestaurant !== id) {
      // If the user switches to a new restaurant, reset the cart
      setCart([]);
    }
    // Set the current restaurant to the new restaurant
    setCurrentRestaurant(id);
  }, [id]);


  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();

  const menuItems = [
    
    {
      label: "Dashboard",
      key: "dashboard",
    },
    { label: "Cart", key: "cart" },
    { label: "Payment", key: "Payment" },
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
      case "Payment":
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
      height: "60px", // Adjust the height here
     
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
      width: "100%",
      height:"50px",
    },
  };


  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get('/data/restaurants.json');
        const allRestaurants = response.data;
        const selectedRestaurant = allRestaurants.find(rest => rest.id === parseInt(id));

        if (selectedRestaurant) {
          setRestaurant(selectedRestaurant);
          setFilteredMenu(selectedRestaurant.menu); 
          if (selectedRestaurant.reviews) {
            setReviews(selectedRestaurant.reviews);
          }
          
        } else {
          setError('Restaurant not found.');
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setError('Failed to fetch restaurant details.');
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const handleAddToCart = (menuItem) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItem = prevCart.find((item)=> item.id=== menuItem.id &&item.restid===menuItem.restid);
      if (existingItem) {
        // If exists, increase quantity
        
        return prevCart;
      } else {
        // If not, add new item
       
        return [...prevCart, { ...menuItem, quantity: 1 }];
        
      }
    });
  };
console.log("hello");
  // const handleViewCart = () => {
  //   navigate('/cart',{ state: { restaurantId: id}});
  // };

  if (error) {
    return <div>{error}</div>;
  }

  if (!restaurant) {
    return <div>Loading...</div>;
  }
  const handleSearch = () => {
    if (restaurant) {
      const filtered = restaurant.menu.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenu(filtered);
      console.log(filtered)
    }
  };
  const handleReset = () => {
    setSearchTerm('');
    setFilteredMenu(restaurant.menu); 
  };
  const handleVegToggle = (checked) => {
    setIsVeg(checked); // Turn on Veg toggle
    setIsNonVeg(false); // Turn off Non-Veg toggle
    if (checked) {
      const filtered = restaurant.menu.filter(item => item.type === 'veg');
      setFilteredMenu(filtered);
    } else {
      setFilteredMenu(restaurant.menu); // Show all if no toggle is active
    }
  };
  
  const handleNonVegToggle = (checked) => {
    setIsNonVeg(checked); // Turn on Non-Veg toggle
    setIsVeg(false); // Turn off Veg toggle
    if (checked) {
      const filtered = restaurant.menu.filter(item => item.type === 'non-veg');
      setFilteredMenu(filtered);
    } else {
      setFilteredMenu(restaurant.menu); // Show all if no toggle is active
    }
  };
  const handleIncreaseQuantity = (itemId,restId) => {
    setCart(prevCart => {
      return prevCart.map(item =>
        item.id === itemId &&item.restid===restId? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  };
  
  const handleDecreaseQuantity = (itemId,restId) => {
    setCart(prevCart => {
      return prevCart.map(item =>
        item.id === itemId  &&item.restid===restId? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 } : item
      ).filter(item => item.quantity > 0); // Filter out items with zero quantity
    });
  };
  
  const handleCloseCartModal = () => {
    setIsCartModalVisible(false);
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
         <IconFont type="icon-shoppingcart" onClick={() => setIsCartModalVisible(true)} style={{ margin: "50px 30px", fontSize: "40px" }} />
      </div>
      
    </nav>
      <Header className="headers">
        <img src={restaurant.image} alt={restaurant.name} className="restaurant-imaging" />
        <h1>{restaurant.name}</h1>
        <p>Location: {restaurant.location}</p>
        <p>Rating: {restaurant.rating} ★</p>
      </Header>
     
      <Content className="contents">
      <div>
      
      <Input
      style={{fontSize:"15px",width:"120px"}}
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Button   style={{margin:"0 15px"}} onClick={handleSearch} type="primary">Search</Button>
      <Button onClick={handleReset} type="primary">Reset</Button>
      <div style={{marginTop:"40px"}}>
      <Switch
      style={{marginRight:"20px"}}
  checked={isVeg}
  onChange={handleVegToggle}
  checkedChildren={<span>🟢 Veg</span>}    // Green circle for Veg
  unCheckedChildren={<span>🟢 veg</span>}  
/>

<Switch
  checked={isNonVeg}
  onChange={handleNonVegToggle}
  checkedChildren={<span>🔴 Non-Veg</span>}   
  unCheckedChildren={<span>🔴 Non-Veg</span>}  
/>

</div>
    </div>
    <div>
        
        <h1>Menu</h1>

  {filteredMenu.length > 0 ? (
    filteredMenu.map((item) => (
      <Card
        key={item.id}
        style={{ marginBottom: '20px' }}
        
      >
        <Meta
          title={<h3 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{item.name}</h3>}
          
          description={(
            <div>
            <img src={item.image} alt={item.name} className="menu-item-image" />
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button type="primary" onClick={() => handleAddToCart(item)}>
                Add to Cart
              </Button>
             
              <Button style={{ marginLeft: '10px' }} type="primary" onClick={() => handleDecreaseQuantity(item.id,item.restid)}>-</Button>
              <p style={{ margin: '0px  10px' }}>{cart.find(cartItem => cartItem.id === item.id&& cartItem.restid===item.restid)?.quantity || 0}</p> {/* Ensure quantity is shown */}
                
                  <Button type="primary" onClick={() => handleIncreaseQuantity(item.id,item.restid)}>+</Button>
                  </div>
            </div>
            
          )}
        />
      </Card>
    ))
  ) : (
    <p>No menu items found</p>
  )}
</div>

{/* {cart.length > 0 && (
  <Button type="primary" onClick={handleViewCart} style={{ marginTop: '20px' }}>
    View Cart
  </Button>
)} */}

      
        <div style={{ marginTop: '40px' }}>
          <h2 style={{fontWeight:"bold", fontSize:"35px"}}>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <Card key={review.id} style={{ marginBottom: '20px' }}>
                <Meta
                  title={review.reviewer}
                  description={
                  <div>
                    <p>{review.comment}</p>  
                    <p>Rating: {review.rating} ★</p>  
                    <p>Date: {review.date}</p>  
                  </div>
            }
                />
              </Card>
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      </Content>
      <Footer className="foot">
        Footer Content
      </Footer>
      <CartModal visible={isCartModalVisible} onClose={handleCloseCartModal} />
    </Layout>
  );
};

export default RestaurantDetails;
