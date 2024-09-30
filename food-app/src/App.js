import React, { useEffect } from "react";
import { supabase } from "./components/supabaseClient";
import GoogleSignIn from "./components/SignIn";
import RestaurantDetails from "./components/RestaurantDetails";
import Dashboard from "./components/dashboard";
import { useRecoilState } from "recoil";
import "./components/signin.css";
import "./components/layoutstyle.css";
import ProfilePage from "./components/ProfilePage.js";
import AddressModal from "./components/addressmodal.js";
import Stepper from "./components/stepper.js";
import { sessionState } from "./atoms/cartstate.js";
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import PaymentPage from "./components/PaymentPage";
import OrderPage from "./components/OrderPage.js";

const usersApiUrl = "http://localhost:4000/users";

function App() {
  const [session, setSession] = useRecoilState(sessionState);
  useEffect(() => {
    const handleAuthChange = async (_event, session) => {
      setSession(session);

      if (session) {
        const user = session.user;
        console.log("Session User:", user);

        const userData = {
          id: user.id,
          name: user.user_metadata.full_name || "Unknown User",
          email: user.email,
        };

        try {
          const response = await axios.get(`${usersApiUrl}/${user.id}`);
          if (response.status === 200) {
            console.log("User already exists:", userData);
            return;
          }
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error("Error checking user existence:", error.message);
            return;
          }
        }

        try {
          await axios.post(usersApiUrl, userData);
          console.log("User data posted:", userData);
        } catch (error) {
          console.error("Error posting user data:", error.message);
        }
      }
    };

    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      authListener.subscription.unsubscribe();
      console.log(`cleaned`, authListener);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={session ? <Dashboard /> : <GoogleSignIn />} />
      <Route
        path="/restaurant/:id"
        element={<ProtectedRoute element={<RestaurantDetails />} />}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute element={<ProfilePage />} />}
      />
      <Route path="/orders" element={<ProtectedRoute element={<Stepper />} />}>
        <Route
          path="orderdetails"
          element={<ProtectedRoute element={<PaymentPage />} />}
        />
        <Route
          path="address"
          element={<ProtectedRoute element={<AddressModal />} />}
        />
        <Route
          path="orderhistory"
          element={<ProtectedRoute element={<OrderPage />} />}
        />
        <Route index element={<ProtectedRoute element={<PaymentPage />} />} />
      </Route>
    </Routes>
  );
}

export default App;
