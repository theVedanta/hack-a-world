import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { Notyf } from "notyf";
import BASE_API_URL from "../BASE_API_URL";

const Nav = ({ auth, pfp }) => {
    const notyf = new Notyf({ dismissible: true, duration: 2000 });

    const onSuccess = async (res) => {
        const { email, googleId, imageUrl } = res.profileObj;
        const authToken = res.tokenObj.access_token;

        const userAuthStatus = await fetch(`${BASE_API_URL}/auth`, {
            method: "POST",
            body: JSON.stringify({
                email,
                googleId,
                imageUrl,
                access_token: authToken,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });

        const jsonRes = await userAuthStatus.json();

        if (jsonRes.access_token) {
            localStorage.setItem("auth-token", jsonRes.access_token);
            window.location.reload();
        } else if (jsonRes.error) {
            localStorage.removeItem("auth-token");
            notyf.error("Some error occurred");
        }
    };
    const onFailure = (error) => {
        notyf.error("Some error has occured");
        console.log(error);
    };

    const logout = () => {
        localStorage.removeItem("auth-token");
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Hack-a-World
                </Link>
                <div
                    className="collapse navbar-collapse"
                    id="navbarNavAltMarkup"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                >
                    <div className="navbar-nav">
                        <Link className="nav-link" to="/">
                            Home
                        </Link>
                        <Link className="nav-link" to="/events">
                            Events
                        </Link>
                        {auth === true ? (
                            <div className="logged-in-flex">
                                <img src={pfp} alt="pfp" className="pfp" />
                                <button
                                    className="nav-link btn btn-danger logout"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <GoogleLogin
                                clientId="574213419539-c4201adt2hs7pe53mhjr2l19ieeklodh.apps.googleusercontent.com"
                                buttonText="Login"
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={"single_host_origin"}
                                render={(renderProps) => (
                                    <button
                                        onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}
                                        className="btn btn-primary nav-link login"
                                    >
                                        Login
                                    </button>
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
