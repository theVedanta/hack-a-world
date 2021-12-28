import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/Nav";
import Index from "./components/Index";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./all.css";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Nav />
                <Routes>
                    <Route path="/" element={<Index helloName="Vedanta" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
