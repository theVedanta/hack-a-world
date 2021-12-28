import { Link } from "react-router-dom";

const Nav = () => {
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
                        <Link className="nav-link" to="/auth">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
