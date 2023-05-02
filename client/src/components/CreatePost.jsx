import React, { useEffect, useState } from "react";
import TalkCard from "./TalkCard";
import NavigationBar from "./NavigationBar";
import WeatherCard from "./WeatherCard";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserIntId } from "./common";

export default function CreatePost({ params }) {

    const initTalk = {
        title: "", 
        content: "",
        likes: 0,
        stars: 0
    };

    const { user, isAuthenticated } = useAuth0();

    const [userId, setUserId] = useState(-1);

    useEffect(() => {
        // fetch user id
        async function wrap() {
            if (isAuthenticated) {
                const id = await getUserIntId({sub: user.sub});
                setUserId(id);
            }
        };
        wrap();
    }, [isAuthenticated]);

    const [talk, setTalk] = useState(initTalk);

    return (
        <div>
            <NavigationBar />
            <div class="thread-holder">
                <TalkCard 
                    talk={talk}
                    cardType={"create"}
                    submitCallBack={() => {
                        alert("Thanks, Your Talk Card has been submitted!");
                        setTalk(initTalk);
                        window.location.replace('/');
                    }}
                    isLoggedin={isAuthenticated && userId >= 0}
                    userId={userId}
                />
            </div>
        </div>
    );
}