import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { profileThunk, logoutThunk, updateUserThunk } from "../services/auth-thunks";
import * as tuitsService from "../services/tuits-service";
import * as whoService from "../services/who-service";
import {Link} from "react-router-dom";

function ProfileScreen() {
    const { currentUser } = useSelector((state) => state.user);
    const [profile, setProfile] = useState(currentUser);
    const [myTuits, setMyTuits] = useState([]);
    const [myFollowing, setMyFollowing] = useState([]);
    const [myFollowers, setMyFollowers] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const save = async () => {
        try {
            await dispatch(updateUserThunk(profile));
        } catch (e) {
            alert(e);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { payload } = await dispatch(profileThunk());
                console.log(payload)
                setProfile(payload);
            } catch (error) {
                console.error(error);
                navigate("/login");
            }
        };
        const fetchMyTuits = async () => {
            try {
                const tuits = await tuitsService.findMyTuits();
                setMyTuits(tuits);
            } catch (error) {
                console.error(error);
            }
        };
        const fetchMyFollowing = async () => {
            try {
                let followingIds = !profile.following ? [] : profile.following;
                let following = await Promise.all(followingIds.map(async followingId => {
                    const following = await whoService.findUserById(followingId)
                    return following;
                }))
                setMyFollowing(following);
            } catch (error) {
                console.error(error);
            }
        };
        const fetchMyFollowers = async () => {
            try {
                let followerIds = !profile.followers ? [] : profile.followers;
                let follower = await Promise.all(followerIds.map(async followerId => {
                    const follower = await whoService.findUserById(followerId)
                    // console.log(follower)
                    return follower;
                }))
                setMyFollowers(follower);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
        fetchMyTuits();
        fetchMyFollowing();
        fetchMyFollowers();
    }, []);

    const handleLogout = async () => {
        await dispatch(logoutThunk());
        navigate("../login");
    };
    const handleUpdate = async () => {
        try {
            await dispatch(updateUserThunk(profile));
        } catch (error) {
            console.error(error);
        }
    };
    if (!profile) {
        return (
            <div>
                <h1>Profile Screen</h1>
                <h3>You need to login first</h3>
            </div>
        );
    }
    console.log("======mytuit=======")
    console.log(myTuits);
    return (
        <div>
            <h1>Profile Screen</h1>

            {profile && (
                <div>
                    <div>
                        <label>Username</label>
                        <input
                            className="form-control"
                            type="text"
                            value={profile.username} readOnly
                        />
                    </div>
                    <div>
                        <label>First Name</label>
                        <input
                            className="form-control"
                            type="text"
                            value={profile.firstName}
                            onChange={(event) => {
                                const newProfile = { ...profile, firstName: event.target.value };
                                setProfile(newProfile);
                            }}
                        />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            className="form-control"
                            type="text"
                            value={profile.lastName ?? ""}
                            onChange={(event) => {
                                const newProfile = { ...profile, lastName: event.target.value };
                                setProfile(newProfile);
                            }}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            className="form-control"
                            type="text"
                            value={profile.email ?? ""}
                            onChange={(event) => {
                                const newProfile = { ...profile, email: event.target.value };
                                setProfile(newProfile);
                            }}
                        />
                    </div>
                    <div>
                        <label>Phone</label>
                        <input
                            className="form-control"
                            type="text"
                            value={profile.phone ?? ""}
                            onChange={(event) => {
                                const newProfile = { ...profile, phone: event.target.value };
                                setProfile(newProfile);
                            }}
                        />
                    </div>
                    <button onClick={handleUpdate} className="btn btn-primary mt-2 mr-4">
                        Update
                    </button>
                    <button className="btn btn-primary mt-2 btn-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}


            <div>
                <div className="row">
                    <div className="col-6">
                        <ul className="list-group mt-2">
                            <li className="list-group-item">
                                <div>
                                    <i className="fa-solid fa-user"></i>
                                    <span className="fw-bolder"> Following: </span> {myFollowing.length ?? ""}
                                </div>
                            </li>

                            {myFollowing.map((user) => (
                                <li className="list-group-item" key={user._id}>
                                    <Link className="nav-link"
                                          to={"/tuiter/profile/"+user._id}
                                          style={{ textDecoration: 'underline', color: 'blue'}}>
                                        <i className="fa-solid fa-arrow-right"></i> {user.firstName} {user.lastName}
                                    </Link>
                                </li>
                            ))}

                        </ul>
                    </div>
                    <div className="col-6">
                        <ul className="list-group mt-2">
                            <li className="list-group-item">
                                <div>
                                    <i className="fa-solid fa-user"></i>
                                    <span className="fw-bolder"> Followers: </span> {myFollowers.length ?? ""}
                                </div>
                            </li>
                            {myFollowers.map((user) => (
                                <li className="list-group-item" key={user._id}>
                                    <Link className="nav-link"
                                          to={"/tuiter/profile/"+user._id}
                                          style={{ textDecoration: 'underline',color: 'blue' }}>
                                        <i className="fa-solid fa-arrow-right"></i>
                                        {user.firstName} {user.lastName}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <br></br>
            <ul className="list-group mt-2">
                <li className="list-group-item">
                    <div>
                        <i className="fa-brands fa-square-twitter"></i>
                        <span className="fw-bolder"> My Tuits: </span>
                    </div>
                </li>
                {myTuits.map((tuit) => (
                    // <li className="list-group-item">
                    //     <div><span className="fw-bolder">{tuit.topic}</span> <i className="fas fa-check-circle wd-blue"></i> {tuit.handle} • {tuit.time}</div>
                    //     <div>{tuit.tuit}</div>
                    // </li>

                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-2">
                                <img width={70} className="float-end rounded-3" src={`./images/${tuit.image}`} />
                            </div>
                            <div className="col-10">
                                <div><span className="fw-bolder">{tuit.username}</span> <i className="fas fa-check-circle wd-blue"></i> {tuit.handle} • {tuit.time}</div>
                                <div>{tuit.tuit}</div>
                            </div>
                        </div>
                    </li>

                ))}
            </ul>
        </div>
    );
}

export default ProfileScreen;
