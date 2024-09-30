import React from "react";
import { supabase } from "./supabaseClient";
import { Button } from "antd";

function GoogleSignIn() {
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        console.error("Error signing in with Google:", error.message);
        alert("Failed to sign in with Google. Please try again.");
        return;
      }
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="sign-in">
      <h1>Sign In with Google</h1>
      <Button type="primary" onClick={handleGoogleSignIn}>
        Sign in with Google
      </Button>
    </div>
  );
}

export default GoogleSignIn;
