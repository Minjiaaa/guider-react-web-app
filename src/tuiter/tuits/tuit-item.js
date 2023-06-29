import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTuitThunk } from "../services/tuits-thunks";
import "./tuit-item.css";
import TuitStats from "./tuit-stats"

const TuitItem = (
    {
        tuit = {
            "topic": "Web Development",
            "userName": "ReactJS",
            "title": "React.js is a component based front end library that makes it very easy to build Single Page Applications or SPAs",
            "time": "2h",
            "image": "react-logo.png",
            "liked": true,
            "replies": 123,
            "retuits": 432,
            "likes": 2345,
            "handle": "@reactjs",
            "tuit": "Today, front-end frameworks and libraries are becoming an essential part of the modern web development stack. React.js is a front-end library that has gradually become the go-to framework for modern web development within the JavaScript community."
        }
    }

) => {
    const dispatch = useDispatch();
    const deleteTuitHandler = (id) => {
        dispatch(deleteTuitThunk(id));
    }

    const { currentUser } = useSelector((state) => state.user);
    const [profile, setProfile] = useState(currentUser);
    const roleUser = currentUser ? currentUser.role : null; // prevent null
    console.log(roleUser)

    return (
        <li className="list-group-item">
            <div className="row">
                <div className="col-2">
                    <img width={70} className="float-end rounded-3" src={`/images/${tuit.image}`} />
                </div>

                <div className="col-10">
                    {/* to complete */}
                    {profile && roleUser === "Admin" && (
                        <i 
                            className="bi bi-x-lg float-end btn btn-danger rounded-pill float-end mt-2 ps-2 pe-2 fw-bold"
                            onClick={() => deleteTuitHandler(tuit._id)}
                        >
                            Delete
                        </i>
                    )}
                    <div className="row">
                        <div><span className="fw-bolder">{tuit.username}</span> <i className="fas fa-check-circle wd-blue"></i> {tuit.handle} • {tuit.time}</div>
                        <div>{tuit.tuit}</div>
                    </div>
                    <br></br>
                    {/* // not shown tuitstats if not a currnt user */}
                    {currentUser && <TuitStats key={tuit._id} tuit={tuit} />}
                </div>
            </div>

        </li>
    );
};
export default TuitItem;