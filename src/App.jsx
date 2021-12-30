import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/Nav";
import Index from "./components/Index";
import Events from "./components/Events";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./all.css";
import { useState, useEffect } from "react";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";
import BASE_API_URL from "./BASE_API_URL";

const App = () => {
    const [auth, setAuth] = useState("awaiting");
    const [pfp, setPfp] = useState("");
    const [organiser, setOrganiser] = useState(false);
    const [userID, setUserID] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const authPr = await fetch(
                `${BASE_API_URL}/auth/pfp?access_token=${localStorage.getItem(
                    "auth-token"
                )}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            const data = await authPr.json();

            if (data.pfp) {
                setAuth(true);
                setPfp(data.pfp);
                setOrganiser(data.organiser);
                setUserID(data._id);
            } else if (data.error) {
                setAuth(false);
                let notyfE = new Notyf({ dismissible: true, duration: 2000 });
                notyfE.error("Some error has occurred");
                console.log(data.error);
            } else {
                setAuth(false);
            }
        };

        try {
            checkAuth();
        } catch (err) {
            setAuth(false);
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                <Nav auth={auth} pfp={pfp} />
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Index org={organiser} onOrg={setOrganiser} />}
                    />
                    <Route
                        exact
                        path="/events"
                        element={<Events org={organiser} id={userID} />}
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
