import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, notification, Switch, Card, Input, Button } from "antd";
import axios from "axios";
import { useRecoilState } from "recoil";
import { cartState } from "../atoms/cartstate.js";
import AddModal from "./modal.js";
import Navbar from "./navbar.js";
const { Header, Content, Footer } = Layout;
const { Meta } = Card;

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");
  const [cart, setCart] = useRecoilState(cartState);
  const [newCart, setNewCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [isVeg, setIsVeg] = useState(false);
  const [isNonVeg, setIsNonVeg] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const url = `http://localhost:4000/restaurants/${id}`;
        console.log(`Request URL: ${url}`);

        const response = await axios.get(url);

        console.log("API Response:", response.data);
        const selectedRestaurant = response.data;

        if (selectedRestaurant) {
          setRestaurant(selectedRestaurant);
          setFilteredMenu(selectedRestaurant.menu);
          if (selectedRestaurant.reviews) {
            setReviews(selectedRestaurant.reviews);
          }
        } else {
          setError("Restaurant not found.");
        }
      } catch (error) {
        notification.error({
          message: "Error Fetching Restaurant Details",
          description:
            "There was an issue fetching the restaurant Details. Please try again later.",
          placement: "top",
        });
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const handleAddToCart = (menuItem) => {
    const res = cart.length > 0 ? cart[0].restid : null;
    if (res && res != id) {
      setIsAddModalVisible(true);
      setNewCart((prevNewCart) => {
        return [
          ...prevNewCart,
          { ...menuItem, quantity: 1, restaurantName: restaurant.name },
        ];
      });
    } else {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.id === menuItem.id && item.restid === menuItem.restid
        );
        if (existingItem) {
          return prevCart;
        } else {
          return [
            ...prevCart,
            { ...menuItem, quantity: 1, restaurantName: restaurant.name },
          ];
        }
      });
    }
  };
  console.log("hellocart", cart);

  if (error) {
    return (
      <p style={{ top: "100px", left: "100px", fontSize: "30px" }}>
        No menu items found
      </p>
    );
  }

  if (!restaurant) {
    return <div>Loading...</div>;
  }
  const handleSearch = () => {
    if (restaurant) {
      if (!searchTerm) {
        setFilteredMenu(restaurant);
        return;
      }

      const filtered = restaurant.menu.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenu(filtered);
      console.log(filtered);
    }
  };

  const handleVegToggle = (checked) => {
    setIsVeg(checked);
    setIsNonVeg(false);
    if (checked) {
      const filtered = restaurant.menu.filter((item) => item.type === "veg");
      setFilteredMenu(filtered);
    } else {
      setFilteredMenu(restaurant.menu);
    }
  };

  const handleNonVegToggle = (checked) => {
    setIsNonVeg(checked);
    setIsVeg(false);
    if (checked) {
      const filtered = restaurant.menu.filter(
        (item) => item.type === "non-veg"
      );
      setFilteredMenu(filtered);
    } else {
      setFilteredMenu(restaurant.menu);
    }
  };
  const handleIncreaseQuantity = (itemId, restId) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.id === itemId && item.restid === restId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const handleDecreaseQuantity = (itemId, restId) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.id === itemId && item.restid === restId
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
  };

  const handleReplaceCart = () => {
    setCart(newCart);
    console.log("cartnew", newCart);
    setIsAddModalVisible(false);
  };
  return (
    <Layout className="layouts">
      <Navbar />
      <Header className="headers">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="restaurant-imaging"
        />
        <h1>{restaurant.name}</h1>
        <p>Location: {restaurant.location}</p>
        <p>Rating: {restaurant.rating} ★</p>
      </Header>

      <Content className="contents">
        <div>
          <Input
            style={{ fontSize: "15px", width: "120px" }}
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch();
            }}
          />

          <Button
            style={{ margin: "0 15px" }}
            onClick={handleSearch}
            type="primary"
          >
            Search
          </Button>

          <div style={{ marginTop: "40px" }}>
            <Switch
              style={{ marginRight: "20px" }}
              checked={isVeg}
              onChange={handleVegToggle}
              checkedChildren={<span>🟢 Veg</span>}
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
              <Card key={item.id} style={{ marginBottom: "20px" }}>
                <Meta
                  title={
                    <h3 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                      {item.name}
                    </h3>
                  }
                  description={
                    <div>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="menu-item-image"
                      />
                      <p>{item.description}</p>
                      <p>Price: ${item.price}</p>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {!cart.some(
                          (cartItem) =>
                            cartItem.id === item.id &&
                            cartItem.restid === item.restid
                        ) ? (
                          <Button
                            type="primary"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </Button>
                        ) : (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Button
                              type="primary"
                              onClick={() =>
                                handleDecreaseQuantity(item.id, item.restid)
                              }
                            >
                              -
                            </Button>
                            <p style={{ margin: "0px 10px" }}>
                              {cart.find(
                                (cartItem) =>
                                  cartItem.id === item.id &&
                                  cartItem.restid === item.restid
                              )?.quantity || 0}
                            </p>
                            <Button
                              type="primary"
                              onClick={() =>
                                handleIncreaseQuantity(item.id, item.restid)
                              }
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  }
                />
              </Card>
            ))
          ) : (
            <p>No menu items found</p>
          )}
        </div>

        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "35px" }}>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} style={{ marginBottom: "20px" }}>
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
      <Footer className="foot">Footer Content</Footer>

      <AddModal
        visible={isAddModalVisible}
        onClose={handleCloseAddModal}
        onReplace={handleReplaceCart}
        name={restaurant.name}
      >
        hello
      </AddModal>
    </Layout>
  );
};

export default RestaurantDetails;
