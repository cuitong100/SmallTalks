import React, { useEffect, useState } from "react";
import TalkCard from "./TalkCard";
import NavigationBar from "./NavigationBar";
import { getDetailTalk, getUserIntId } from "./common";
import { useParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

export default function Details({ talk }) {

    const { recordId } = useParams();
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [detailTalk, setDetailTalk] = useState(null);

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

    useEffect(() => {
        async function wrap() {
            const dtk = await getDetailTalk({recordId: parseInt(recordId)});
            if (dtk && dtk.length > 0) {
                setDetailTalk(dtk[0]);
            }
        }
        wrap();
    }, []);

    return (
        <div>
            <NavigationBar />
            <div className="thread-holder">
                {recordId && detailTalk ? (
                    <TalkCard
                        talk={detailTalk}
                        cardType={"detail"}
                        userId={userId}
                        isLoggedin={isAuthenticated}
                    />
                ) : (
                    <p>
                        Sorry, we did not find the record you look for.
                    </p>
                )}
            </div>
        </div>
    )
};