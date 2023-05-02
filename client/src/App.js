import React, { useEffect, useState } from "react";
import './App.css';
import TalkCard from './components/TalkCard';
import { UserProvider } from './UserContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Details from './components/Details';
import Signup from './components/Signup';
import VerifyUser from './components/VerifyUser';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import CreatePost from "./components/CreatePost";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={
              <Home />
            } />
            <Route path="/create" element={
              <CreatePost />
            } />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path='/profile' element={
              <Profile
                name="John Doe"
                title="Software Engineer"
                bio="I am a full-stack developer with experience in React, Node.js, and SQL."
                imageUrl="https://example.com/profile.jpg"
                tags={['React', 'Node.js', 'SQL']}
                userId={2173}
              />
            } />
            <Route path='/login' element={
              <Login />
            } />
            
            <Route path='/signup' element={
              <Signup />
            } />
            <Route path='/details/:recordId' element={
              <Details />
            } />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
