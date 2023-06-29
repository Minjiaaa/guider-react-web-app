import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TuitItem from "./tuit-item";
import YoutubeItem from "./youtube-item";
import { findTuitsThunk } from "../services/tuits-thunks";

const TuitList = () => {
    const { tuits, loading, searchResults, youtubeSearchResults } = useSelector((state) => state.tuits);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    // const { following } = currentUser[""]
    // let isFollowed = false;
    // let myProfile = currentUser;
    // if (currentUser && currentUser.following && currentUser.following.includes(whoToFollow._id)) {
    //     isFollowed = true;
    // }

    useEffect(() => {
        dispatch(findTuitsThunk());
    }, []);

    let displayedTuits = tuits;
    if (currentUser) {
        // List of UserIds
        const following = currentUser.following;
        displayedTuits = displayedTuits.filter((tuit) => following.includes(tuit.author));
        // for each tuit in displayedTuits
        //    if following.contains(tuit.author) then
        //       keep tuit
    }

    return (
        <ul className="list-group">
            {loading && <li className="list-group-item">Loading...</li>}
            {displayedTuits.map((tuit) => (
                <TuitItem key={tuit._id} tuit={tuit} />
            ))}
        </ul>
    );
};

export default TuitList;