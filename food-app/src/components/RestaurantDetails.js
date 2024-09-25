// components/RestaurantDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout ,notification } from 'antd';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { cartState } from '../atoms/cartstate.js';
import { currentRestaurantState,currentPrevState } from '../atoms/cartstate.js';
import {  Input } from 'antd';
import { Switch ,Card } from 'antd';
import CartModal from './Cart.js';
import AddModal from './modal.js';
import { Avatar} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CustomerServiceOutlined } from '@ant-design/icons';
import { supabase } from './supabaseClient';


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
  const [newCart , setNewCart]=useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [isVeg, setIsVeg] = useState(false); 
  const [isNonVeg, setIsNonVeg] = useState(false); // Initial state set to Non-Veg
  const [reviews, setReviews] = useState([]);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  // const [currentRestaurant, setCurrentRestaurant] = useRecoilState(currentRestaurantState); // Use Recoil state
  // const [prev,setPrev]=useRecoilState(currentPrevState);
  const [session, setSession] = useState(null);
 
  // useEffect(() => {
    
  //   setCurrentRestaurant(prev);
  // }, [id, currentRestaurant, setCurrentRestaurant, cart]);

  



  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();

  const menuItems = [
    
    {
      label: "Home",
      key: "home",
    },
    // { label: "Cart", key: "cart" },
    // { label: "Payment", key: "Payment" },
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
     
    padding: "0 20px",
      position: "relative",
    },
    menu: {
      backgroundColor: "transparent",
      borderBottom: "none",
      lineHeight: screens.sm ? "4rem" : "3.5rem",
      marginLeft: screens.md ? "0px" : `-${token.size}px`,
      width: screens.md ? "inherit" : token.sizeXXL,
      fontSize: '2rem'
      
    },
    menuContainer: {
      alignItems: "center",
      display: "flex",
      gap: token.size,
      justifyContent: 'space-between', 
      width: "100%",
      height:"50px",
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px', // Adjust the gap between the icons
      marginTop:"5px",
    },
  };
  // useEffect(() => {
  //   const deleteOrders = async () => {
  //     try {
  //       await axios.delete('http://localhost:4000/orders');
  //       console.log('Orders deleted successfully');
  //     } catch (error) {
  //       console.error('Error deleting orders:', error.message || error);
  //     }
  //   };

  //   if (cart.length === 0) {
  //     deleteOrders();
  //   }
  // }, [cart]);
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
console.log('sample');
  useEffect(() => {
    console.log('example');
    const fetchRestaurantDetails = async () => {
      try {
        console.log(`Fetching details for restaurant ID: ${id}`);
        const url = `http://localhost:4000/restaurants/${id}`;
        console.log(`Request URL: ${url}`);
        
        const response = await axios.get(url);
        
        console.log('API Response:', response.data);
        const selectedRestaurant = response.data;
    
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
        console.error('Error fetching restaurant details:', error.message || error);
        notification.error({
          message: 'Error Fetching Restaurant Details',
          description: 'There was an issue fetching the restaurant Details. Please try again later.',
          placement:'top',
        });
      }
    };
    

    fetchRestaurantDetails();
  }, [id]);

  const handleAddToCart = (menuItem) => {
    const res = cart.length > 0 ? cart[0].restid: null;
    if (res && res!= id) {
      
         setIsAddModalVisible(true);
         setNewCart(prevNewCart => {
        
           
            return [...prevNewCart, { ...menuItem, quantity: 1,restaurantName: restaurant.name}];
            
          }
        
        );
         
        }
    else{
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItem = prevCart.find((item)=> item.id=== menuItem.id &&item.restid===menuItem.restid);
      if (existingItem) {
        // If exists, increase quantity
        
        return prevCart;
      } else {
        // If not, add new item
       
        return [...prevCart, { ...menuItem, quantity: 1,restaurantName: restaurant.name}];
        
      }
    
    });
  }
  
  // setPrev(id);
  };
console.log("hellocart",cart);
  // const handleViewCart = () => {
  //   navigate('/cart',{ state: { restaurantId: id}});
  // };

  if (error) {
    return <p style={{top:"100px", left:"100px", fontSize:"30px"}}>No menu items found</p>;
  }

  if (!restaurant) {
    return <div>Loading...</div>;
  }
  const handleSearch = () => {
    if (restaurant) {
      if(!searchTerm)
      {
        setFilteredMenu(restaurant);
        return;
      }
      
      const filtered = restaurant.menu.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenu(filtered);
      console.log(filtered)
    
    }
  };
  // const handleReset = () => {
  //   setSearchTerm('');
  //   setFilteredMenu(restaurant.menu); 
  // };
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
 
  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
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
  const handleReplaceCart = () => {
    // setCart([]); // Clear the cart
    setCart(newCart);
    console.log('cartnew',newCart);
    setIsAddModalVisible(false); // Close the AddModal
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
        onChange={(e) => {setSearchTerm(e.target.value);handleSearch()}}
      />

      <Button   style={{margin:"0 15px"}} onClick={handleSearch} type="primary">Search</Button>
      {/* <Button onClick={handleReset} type="primary">Reset</Button> */}
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
              {!cart.some(cartItem => cartItem.id === item.id && cartItem.restid === item.restid) ? (
                <Button type="primary" onClick={() => handleAddToCart(item)}>
                  Add to Cart
                </Button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button type="primary" onClick={() => handleDecreaseQuantity(item.id, item.restid)}>-</Button>
                  <p style={{ margin: '0px 10px' }}>
                    {cart.find(cartItem => cartItem.id === item.id && cartItem.restid === item.restid)?.quantity || 0}
                  </p>
                  <Button type="primary" onClick={() => handleIncreaseQuantity(item.id, item.restid)}>+</Button>
                </div>
              )}
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
      <AddModal visible={isAddModalVisible}  onClose={handleCloseAddModal} onReplace={handleReplaceCart} name={restaurant.name}>
              hello
                
            </AddModal>
    </Layout>
  );
};

export default RestaurantDetails;
