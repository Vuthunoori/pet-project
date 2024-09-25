import React, { useEffect, useState } from 'react';
import { supabase } from './components/supabaseClient';
import GoogleSignIn from './components/SignIn';
import RestaurantDetails from './components/RestaurantDetails';
import Dashboard from './components/dashboard';
import './components/signin.css';
import './components/layoutstyle.css';
import ProfilePage from './components/ProfilePage.js';
import axios from 'axios';

import { Routes, Route, useNavigate } from 'react-router-dom';

import PaymentPage from './components/PaymentPage';
import OrderPage from './components/OrderPage.js';

const usersApiUrl = 'http://localhost:4000/users';

function App() {
  const [session, setSession] = useState(null); 
  
  console.log(`session start`,session);// State to hold the current session
  //const [loading, setLoading] = useState(true); // Loading state to manage session check
  const navigate = useNavigate();
// console.log('check');


  useEffect(() => {
    const handleAuthChange = async (_event, session) => {
      console.log(`start sample`,session);
      setSession(session);
      console.log(`sessionthere`,session);
      //setLoading(false);
  
      if (session) {
        const user = session.user;
        console.log('Session User:', user);

        const userData = {
          id: user.id,
          name: user.user_metadata.full_name || 'Unknown User',
          email: user.email,
        };
  
        try {
          // Check if user already exists before posting
          const response = await axios.get(`${usersApiUrl}/${user.id}`);
          if (response.status === 200) {
            console.log('User already exists:', userData);
            return; // Exit if user already exists
          }
        } catch (error) {
          // Proceed if user doesn't exist
          if (error.response?.status !== 404) {
            console.error('Error checking user existence:', error.message);
            return;
          }
        }
  
        try {
          await axios.post(usersApiUrl, userData);
          console.log('User data posted:', userData);
        } catch (error) {
          console.error('Error posting user data:', error.message);
        }
        
        
      }

    };
  
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);
  
    return () => {
      authListener.subscription.unsubscribe();
      console.log(`cleaned`,authListener);
    };
  }, []);
  

  return (
    <Routes>
      <Route path="/" element={session ? <Dashboard /> : <GoogleSignIn />} />
      <Route path="/restaurant/:id" element={<RestaurantDetails />} />
      <Route path="/pay" element={<PaymentPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;



