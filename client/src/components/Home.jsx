import React, { useEffect, useState } from "react";
import TalkCard from "./TalkCard";
import NavigationBar from "./NavigationBar";
import WeatherCard from "./WeatherCard";
import { getAllTalks, getAllTalksCreatedBy, getUserIntId } from "./common";
import { useAuth0 } from "@auth0/auth0-react";

export default function Home({ params }) {

    const [talks, setTalks] = useState([]);
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [toUpdate, setToUpdate] = useState(false);

    const [userId, setUserId] = useState(-1);

    useEffect(() => {
        // fetch all talks
        // console.log(user);
        async function wrap() {
            if (isAuthenticated) {
                const id = await getUserIntId({sub: user.sub});
                setUserId(id);
                getAllTalksCreatedBy(setTalks, parseInt(id));
            } else {
                getAllTalks(setTalks);
            }
        };
        wrap();        
    }, [toUpdate, isAuthenticated]);

    return (
        <div>
            <NavigationBar />
            <div className="thread-holder">
            <WeatherCard />
                {
                    talks.map((talk, index) => {
                        return (
                            <TalkCard 
                                talk={talk}
                                cardType={"home"}
                                key={index}
                                userId={userId}
                                setToUpdate={setToUpdate}
                                isLoggedin={isAuthenticated && userId >= 0}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
}