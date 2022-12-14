import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { callApi } from "../api";

import Home from "./Home";
import Navigation from "./Navigation";
import Activity from "./Activity";
import Activities from "./Activities";
import AccountForm from "./AccountForm";
import MyProfile from "./MyProfile";
import Routines from "./Routines";
import RoutinesByUser from "./RoutinesByUser"

const App = () => {

    const [activities, setActivities] = useState([]);
    const [token, setToken] = useState(window.localStorage.getItem('token') || "");
    const [user, setUser] = useState(null);

    const [error, setError] = useState('');
 

    useEffect(() => {
        window.localStorage.setItem("token", token);
    }, [token]);

    useEffect(() => {
        const getActivities = async () => {
            try {
                const activities = await callApi({ path: "activities" });
                setActivities(activities);
            } catch (error) {
                console.log(error);
                setError(error);
            }
        };
        getActivities()
    }, [token])
    

    useEffect(() => {
        try {
            if (token) {
                const getUser = async () => {
                    try {
                        const user = await callApi({method: "GET", path: "/users/me", token});
                        setUser(user);
                    } catch (error) {
                        console.log(error);
                        setError(error);
                    }
                };
                getUser();
            }
        } catch (error) {
            console.log(error);
            setError(error);
        }
    }, [token])

    return (
        <>
            <Navigation token={token} setToken={setToken} setUser={setUser} />
            <Routes>
                <Route path="/" element={<Home user={user} token={token}/>} />
                <Route path="/users/:action" element={<AccountForm setToken={setToken} />}></Route>
                <Route path="/routines" element={<Routines token={token} user={user} />}></Route>
                <Route path="/routines/:routineId" element={<Routines token={token} user={user} />}></Route>
                <Route path="/users/me" element={<MyProfile token={token} user={user} />} />
                <Route path="/activities" element={<Activities activities={activities} setActivities={setActivities} token={token} user={user}/>} />
                <Route path="/Activities/:postId" element={<Activity activities={activities} setActivities={setActivities} token={token} user={user} />} ></Route>
                <Route path="/users/:username/routines" element={<RoutinesByUser token={token} user={user} />}></Route>
            </Routes>
        </>
    );
};

export default App;