import React, { useEffect, useState } from 'react';
import { supabase } from './components/supabaseClient';
import GoogleSignIn from './components/SignIn';
import RestaurantDetails from './components/RestaurantDetails';
import Dashboard from './components/dashboard';
import './components/signin.css';
import './components/layoutstyle.css';

import { Routes, Route, useNavigate } from 'react-router-dom';

import PaymentPage from './components/PaymentPage';
import OrderPage from  './components/OrderPage.js';

function App() {
  const [session, setSession] = useState(null); // State to hold the current session
  const navigate = useNavigate();
  // console.log("check123!")

  useEffect(() => {
    // Function to handle user creation and setting session
    const handleAuthChange = async (
      _event,
      session,
    ) => {
      setSession(session);
      if (session) {
        navigate('/dashboard'); // Redirect to dashboard if authenticated
      } else {
        navigate('/'); // Redirect to sign-in page if not authenticated
      }   
      // console.log({session});
    };

    // Listen for changes to auth state (login, logout)
    const { data: authListener } =
    supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      authListener.subscription.unsubscribe();
    };
  },[]);
 
  return (
   
    
    <Routes>
    <Route path="/" element={<GoogleSignIn />} />
    <Route path="/dashboard" element={session ? <Dashboard /> : <GoogleSignIn />} />
    <Route path="/restaurant/:id" element={<RestaurantDetails />} />
   
    <Route path="/pay" element={<PaymentPage />} />
    <Route path="/order" element={<OrderPage />} />
  </Routes>



  );
}

export default App;
