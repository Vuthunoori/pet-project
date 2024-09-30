import { useState, useCallback } from "react";
import axios from "axios";
import { notification } from "antd";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLon / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
const useFetchRestaurants = (location) => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/restaurants");
      const allRestaurants = response.data;

      if (location) {
        const sortedRestaurants = allRestaurants
          .map((restaurant) => {
            const distance = calculateDistance(
              location.latitude,
              location.longitude,
              restaurant.latitude,
              restaurant.longitude
            );
            return { ...restaurant, distance };
          })
          .sort((a, b) => a.distance - b.distance);

        setRestaurants(sortedRestaurants);
        setFilteredRestaurants(sortedRestaurants);
      } else {
        // If no location, display all restaurants
        setRestaurants(allRestaurants);
        setFilteredRestaurants(allRestaurants);
      }
    } catch (error) {
      notification.error({
        message: "Error Fetching Restaurants",
        description:
          "There was an issue fetching the restaurants. Please try again later.",
      });
    }
    setLoading(false);
  }, [location]);

  return {
    restaurants,
    filteredRestaurants,
    loading,
    fetchRestaurants,
    setFilteredRestaurants,
  };
};

export default useFetchRestaurants;
