import React, { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import { useAuth0} from "@auth0/auth0-react";
import { getLikedTalks } from "./common";
import TalkCard from "./TalkCard";


export default function Profile({setToUpdate}) {

  const baseEnvUrl = process.env.REACT_APP_API_URL;

  const { user, getAccessTokenSilently, isAuthenticated} = useAuth0();
  
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [talks, setTalks] = useState([]);
  const [userId, setUserId] = useState(-1);

  useEffect(() => {
    // fetch all talks
    if (isAuthenticated && userId >= 0) {
      getLikedTalks(setTalks, {userId});
    }
  }, [userId, isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated){
          async function fetchUserData() {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${baseEnvUrl}/user`,{
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            setIsLoading(false);
            // console.log("user.sub", user.sub)
            const data = await response.json();
            // console.log("data", data);
            setProfileData(data);
            setUserId(data.id);
          }
          if (user) {
            fetchUserData();
          } 
        }
       
      } catch (error) {
        console.log("xxx", error)
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      if (!profileData.username || !profileData.username.trim()) {
        alert('Username cannot be empty or contain only whitespace.');
        return;
      }
      
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${baseEnvUrl}/user/${profileData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ username: profileData.username }),
      });
  
      if (!response.ok) {
        throw new Error('Error updating username');
      }
  
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  

  if (isLoading) {
    return (
    <div>
      <NavigationBar />
      <p>Loading...</p>
    </div>
    )
    ;
  }

  if (error) {
    return (
      <div>
        <NavigationBar />
        <p>Error: {error}</p>
      </div>
      )
      ;
  }
  return (
    <div>
      <NavigationBar/>
      <h1>My Profile</h1>
      <div>
        <img src={user.picture} width="70" alt="profile avatar" />
      </div>
      <div>
        <p>✅  UserId: {profileData.id}</p>  
      </div>
      <div>
        <p>😀 UserName: {isEditing ? (
          <input
            type="text"
            value={profileData.username}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
          />
          ) : (
            profileData.username
          )}
          </p>
          {isEditing ? (
            <button onClick={handleSaveClick}>Save</button>
          ) : (
            <button onClick={handleEditClick}>Edit</button>
          )}
      </div>
      <div>
        <p>🔑 Auth0Id: {profileData.auth0Id}</p>
      </div>
      <div>
        <p>📧 Email: {user.email}</p>
      </div>
      <p>
        <span>&#x1F44D;</span>
        Your liked Talks:</p>
      <div className="thread-holder">
          {
            talks.map((talk, index) => {
                return (
                    <TalkCard 
                        talk={talk}
                        cardType={"like"}
                        key={index}
                        userId={profileData.id}
                        setToUpdate={setToUpdate}
                        isLoggedin={isAuthenticated}
                    />
                );
            })
          }
          </div>
    </div>
  );
};
