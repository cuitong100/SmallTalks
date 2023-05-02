import React from 'react';
import ReactDOM from 'react-dom/client';
import { useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useNavigate } from "react-router-dom";

export default function VerifyUser() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();

  useEffect(() => {
    console.log('Access Token:', accessToken);

    async function verifyUser() {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.status < 400) {
        const user = await data.json();
        console.log('User Data:', user);
      
        if (user.auth0Id) {
          navigate('/');
        }
      } else {
        console.error('API Error:', data.status, data.statusText);
      }

    //   console.log("xxxxxxxx")
    //   const user = await data.json();
    //   console.log("xxxxxxxx")
    //   console.log("User", user)
    //   if (user.auth0Id) {
    //     console.log("User.auth0ID", user.auth0Id)
    //     navigate("/");
    //   }
    }

    if (accessToken) {
      verifyUser();
      //navigate('/');
    } 
  }, [accessToken]);

  return <div className="loading">Loading...</div>;
}