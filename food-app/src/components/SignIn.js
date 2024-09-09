import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Button } from 'antd';


function GoogleSignIn() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) {
        console.error('Error signing in with Google:', error.message);
        alert('Failed to sign in with Google. Please try again.');
      } else {
        console.log('Sign-in initiated. Please wait for redirection...');
        // Assuming you are handling redirection in a way that allows us to know when it's done
        // For example, you might use a redirect URL in your OAuth settings or handle it on the client-side
        // Here, we simulate redirection after successful sign-in
        navigate('/dashboard'); // Navigate to /menu path
      }
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
