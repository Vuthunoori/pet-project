import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, Spin, Input } from "antd";
import useFetchRestaurants from "../hooks/useFetchRestaurants";
const RestaurantListings = () => {
  const [location, setLocation] = useState(null);
  const [locationAccessDenied, setLocationAccessDenied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    restaurants,
    filteredRestaurants,
    loading,
    fetchRestaurants,
    setFilteredRestaurants,
  } = useFetchRestaurants(location);
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationAccessDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      () => {
        setLocationAccessDenied(true);
      },
      { timeout: 10000 }
    );
  }, []);
  useEffect(() => {
    if (location || locationAccessDenied) {
      fetchRestaurants();
    } else {
      getLocation();
    }
  }, [location, locationAccessDenied, fetchRestaurants, getLocation]);

  const filterRestaurants = () => {
    if (!searchTerm) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = restaurants.filter((restaurant) => {
      return (
        restaurant.name.toLowerCase().includes(term) ||
        restaurant.location.toLowerCase().includes(term) ||
        restaurant.menu.some((menuItem) => {
          return (
            menuItem.name.toLowerCase().includes(term) ||
            menuItem.description.toLowerCase().includes(term)
          );
        })
      );
    });

    setFilteredRestaurants(filtered);
  };

  const handleSearch = () => {
    filterRestaurants();
  };

  return (
    <div>
      <div>
        <Input
          style={{ fontSize: "15px", width: "130px" }}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            filterRestaurants(searchTerm);
          }}
        />

        <Button
          style={{ margin: "0 15px" }}
          onClick={handleSearch}
          type="primary"
        >
          Search
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <div>
          <div className="restaurant-list">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="restaurant-card">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="restaurant-image"
                  />
                  <div className="restaurant-details">
                    <h2 className="restaurant-name">
                      <Link to={`/restaurant/${restaurant.id}`}>
                        {restaurant.name}
                      </Link>
                    </h2>
                    <p className="restaurant-location">
                      Location: {restaurant.location}
                    </p>
                    {location && (
                      <p>Distance: {restaurant.distance.toFixed(2)} km</p>
                    )}
                    <p className="restaurant-rating">
                      Rating: {restaurant.rating}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No restaurants found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantListings;
