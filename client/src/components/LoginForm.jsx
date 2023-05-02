import React, { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import TalkCard from "./TalkCard";

export default function LoginForm({ params }) {
    const { loginWithRedirect } = useAuth0();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // const handleLogin = () => {
    //     // Here, you would typically send a request to your backend to authenticate the user
    //     // and set the `isLoggedIn` state based on the response.
    //     setIsLoggedIn(true);
    // };

    const handleLogin = () => {
        loginWithRedirect({
          connection: 'Username-Password-Authentication',
          username : email,
          password : password,
        });
      };

    const handleSignUp = () => {
        // Navigate to Signup page
        window.location.replace('/signup');
    };

    return (
        <div class="login-container">
            <h3>Login</h3>
            <form >
                <label class="login-tag">
                    Email:
                </label>
                <input type="text" value={email} onChange={handleEmailChange} />
                <br />
                <label class="login-tag">
                    Password:
                </label>
                <input type="password" value={password} onChange={handlePasswordChange} />
                <br />
                <button type="button" onClick={handleLogin} class="login-butn">
                    Login
                </button>
                <button type="button" onClick={handleSignUp} class="login-butn">
                    Create Account
                </button>
            </form>
            {isLoggedIn && <p>You are logged in!</p>}
        </div>
    );

};