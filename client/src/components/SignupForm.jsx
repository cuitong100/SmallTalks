import React, { useEffect, useState } from "react";
import TalkCard from "./TalkCard";

export default function SignupForm({ params }) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [isSignedUp, setIsSignedUp] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPwd(event.target.value);
    };

    const handleLogin = () => {
        // Navigate to Login Page
        window.location.replace('/login');
    };

    const handleSignUp = () => {
        // Here, you would typically send a request to your backend to authenticate the user
        setIsSignedUp(true);
    };

    return (
        <div class="login-container">
            <h3>Sign Up</h3>
            <form >
                <label class="login-tag">
                    Email:
                </label>
                <input type="text" value={email} onChange={handleEmailChange} />
                <br />
                <label class="login-tag">
                    Name:
                </label>
                <input type="text" value={name} onChange={handleNameChange} />
                <br />
                <label class="login-tag">
                    Password:
                </label>
                <input type="password" value={password} onChange={handlePasswordChange} />
                <br />
                <label class="login-tag">
                    Confirm Password:
                </label>
                <input type="password" value={confirmPwd} onChange={handleConfirmPasswordChange} />
                <br />
                <button type="button" onClick={handleLogin} class="login-butn">
                    Login
                </button>
                <button type="button" onClick={handleSignUp} class="login-butn">
                    Create Account
                </button>
            </form>
            {isSignedUp && <p>You are signed up!</p>}
        </div>
    );

};