import React, { useEffect, useState } from "react";
import TalkCard from "./TalkCard";
import NavigationBar from "./NavigationBar";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function Login({ params }) {
    const navigate = useNavigate();
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const signUp = () => loginWithRedirect({ screen_hint: "signup" });

    const handleLogout = () => {
      logout({ returnTo: window.location.origin });
      navigate("/");
    };
    return (
        <div>
            <NavigationBar />
            {!isAuthenticated ? (
          <button onClick={loginWithRedirect} className="login-butn">
            Log in or Create an Account
          </button>
        ) : (
          <button  onClick={handleLogout} className="login-butn">
            Log out
          </button>
        )}
        </div>
  )
};