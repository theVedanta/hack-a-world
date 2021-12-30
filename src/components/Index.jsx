import BASE_API_URL from "../BASE_API_URL";
import { Notyf } from "notyf";

const Index = ({ org, onOrg }) => {
    const flipOrg = async () => {
        const data = await fetch(
            `${BASE_API_URL}/auth/change-role?access_token=${localStorage.getItem(
                "auth-token"
            )}`
        );
        const dataJson = await data.json();

        if (dataJson.done) {
            onOrg(!org);
        } else {
            console.log(dataJson);
            let notyfE = new Notyf({ dismissible: true, duration: 2000 });
            notyfE.error("Some error has occurred");
        }
    };
    return (
        <div className="container">
            <h1 className="display-2 mt-4">Landing Page</h1>
            <p>Imagine a beautiful landing page here ✨</p>
            <br />
            <br />
            <h1 className="display-6">
                You are {org ? "Organiser" : "User"} right now. (only available
                when logged in)
            </h1>
            <p>(Only for development and testing)</p>
            <button className="btn btn-primary" onClick={flipOrg}>
                Change
            </button>
        </div>
    );
};

export default Index;
