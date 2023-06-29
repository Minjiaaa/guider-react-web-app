import React, { useState } from "react";
import TuitList from "./tuits";
import TuitStats from "./tuits/tuit-stats";
import "./index.css";
import WhatsHappening from "./whats-happening";
import { useSelector } from "react-redux";

function HomeScreen() {
    const { currentUser, tuits } = useSelector((state) => ({
        currentUser: state.user.currentUser,
        tuits: state.tuits.tuits
    }));
    const [profile, setProfile] = useState(currentUser);

    return (
        <div>
            <h1>Welcome to Guider!</h1>
            {profile && (
                <WhatsHappening />
            )}

            <TuitList />
            {/* {currentUser ? (
                <div>
                   
                    <TuitStats tuits={tuits} />
                </div>
            ) : (
                <TuitList />
            )} */}
        </div>
    );
}

export default HomeScreen;
