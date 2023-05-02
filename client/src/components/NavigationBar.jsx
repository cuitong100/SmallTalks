import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import LoginButton from './LoginButton';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserName } from './common';

const NavigationBar = () => {

  const { user, isAuthenticated } = useAuth0();

  const [profileTag, setProfileTag] = useState("Visitor");

    useEffect(() => {
        // fetch user id
        async function wrap() {
            if (isAuthenticated) {
                const name = await getUserName({sub: user.sub});
                setProfileTag("Profile of " + name);
            } else {
              setProfileTag("Visitor");
            }
        };
        wrap();
    }, [isAuthenticated]);

  return (
    <nav className='Navi'>
      <ul className='NaviUl'>
      <li className='NaviLi'>
          <Link to="/" className='logoText'>Elevator Talk Collect</Link>
        </li>
        <li className='NaviLi'>
          <Link to="/">Home</Link>
        </li>
        <li className='NaviLi'>
          <Link to="/create">Add Talk</Link>
        </li>
        <li className='NaviLi'>
          <Link to="/login">
            {isAuthenticated ? "Log out" : "Log in"}
          </Link>
          {/* <LoginButton/> */}
          {/* <Link to="/login">Log in/out</Link> */}
        </li>
        <li className="profile">
            <Link to="/profile">
              {profileTag}
            </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
