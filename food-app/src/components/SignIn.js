import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Button } from 'antd';
import axios from 'axios';

const usersApiUrl = 'http://localhost:4000/users';

function GoogleSignIn() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
   
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
        alert('Failed to sign in with Google. Please try again.');
        return;
      }

      // Assuming you have a redirect URL or a way to get session info
      // This example assumes you handle the redirect and fetch session later
      // For example, you might use a redirect URL in your OAuth settings or handle it on the client-side
      
      // const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      // if (sessionError) {
      //   console.error('Error fetching session:', sessionError.message);
      //   return;
      // }

      // if (session) {
      //   const user = session.user;

      //   // Post user data to API
      //   const userData = {
      //     id: user.id,
      //     name: user.user_metadata.full_name || 'Unknown User',
      //     email: user.email,
      //   };
      //   console.log(`user:`,userData);

      //   await axios.post(usersApiUrl, userData);
      //   console.log('User data posted:', userData,session.user);

        
      // }
    } catch (error) {
      console.error('Error during sign-in:', error.message);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="sign-in">
      <h1>Sign In with Google</h1>
      <Button type="primary" onClick={handleGoogleSignIn}>Sign in with Google</Button>
    </div>
  );
}

export default GoogleSignIn;
