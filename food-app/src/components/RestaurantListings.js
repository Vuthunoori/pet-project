import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Spin ,Input ,  notification} from 'antd';




// Helper function to calculate the distance between two geographical points using the Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLon / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const RestaurantListings = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationAccessDenied, setLocationAccessDenied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/restaurants');
      const allRestaurants = response.data;
console.log(allRestaurants);
      if (location) {
        const sortedRestaurants = allRestaurants.map((restaurant) => {
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            restaurant.latitude,
            restaurant.longitude
          );
          return { ...restaurant, distance };
        }).sort((a, b) => a.distance - b.distance);

        setRestaurants(sortedRestaurants);
        setFilteredRestaurants(sortedRestaurants);
      } else {
        setRestaurants(allRestaurants);
        setFilteredRestaurants(allRestaurants);
      }
    } catch (error) {
      notification.error({
        message: 'Error Fetching Restaurants',
        description: 'There was an issue fetching the restaurants. Please try again later.',
      });
    }
    setLoading(false);
  }, [location]);

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
          // Check if the menu item is an object with name or description
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

  // const handleReset = () => {
  //   setSearchTerm('');
  //   setFilteredRestaurants(restaurants); // Show all restaurants
  // };

  return (
    <div>
      <div>
      
        <Input
        style={{fontSize:"15px",width:"130px"}}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value); filterRestaurants(searchTerm)}}
        />

        <Button   style={{margin:"0 15px"}} onClick={handleSearch} type="primary">Search</Button>
       {/* <Button onClick={handleReset} type="primary">Reset</Button> */}
      </div>

     
      {loading ? (
        <Spin />
      ) : (
        <div>
          <div className="restaurant-list">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="restaurant-card">
                  <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
                  <div className="restaurant-details">
                    <h2 className="restaurant-name">
                      <Link to={`/restaurant/${restaurant.id}`}>{restaurant.name}</Link>
                    </h2>
                    <p className="restaurant-location">Location: {restaurant.location}</p>
                    {location && (
                      <p>
                        Distance: {restaurant.distance.toFixed(2)} km
                      </p>
                    )}
                    <p className="restaurant-rating">Rating: {restaurant.rating}</p>
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
