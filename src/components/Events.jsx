import BASE_API_URL from "../BASE_API_URL";
import { Notyf } from "notyf";
import { useState, useEffect } from "react";
import { FaLink, FaPlus, FaTrashAlt } from "react-icons/fa";

const Events = ({ org, id }) => {
    const [events, setEvents] = useState([]);
    const [createView, setCreateView] = useState(false);
    const [online, setOnline] = useState(false);

    const fetchEvents = async () => {
        const fetchedEventsJson = await fetch(`${BASE_API_URL}/events`);
        const fetchedEvents = await fetchedEventsJson.json();
        setEvents(fetchedEvents.events);
    };

    const getToday = (max) => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0 so need to add 1 to make it 1!
        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = "0" + dd;
        }
        if (mm < 10) {
            mm = "0" + mm;
        }
        if (max) {
            yyyy += 5;
        }

        today = yyyy + "-" + mm + "-" + dd;
        return today;
    };

    const removeLink = (e) => {
        let link;

        if (e.target.parentElement.classList.contains("btn-danger")) {
            link = e.target.parentElement.parentElement;
        } else if (
            e.target.parentElement.parentElement.classList.contains(
                "btn-danger"
            )
        ) {
            link = e.target.parentElement.parentElement.parentElement;
        } else {
            link = e.target.parentElement;
        }

        if (document.querySelector(".links").children.length === 1) {
            let notyfE = new Notyf({ dismissible: true, duration: 2000 });
            notyfE.error("Need atleast one link");
        } else link.remove();
    };
    const removeTag = (e) => {
        let tag;

        if (e.target.parentElement.classList.contains("btn-danger")) {
            tag = e.target.parentElement.parentElement;
        } else if (
            e.target.parentElement.parentElement.classList.contains(
                "btn-danger"
            )
        ) {
            tag = e.target.parentElement.parentElement.parentElement;
        } else {
            tag = e.target.parentElement;
        }

        if (document.querySelector(".tags").children.length === 1) {
            let notyfE = new Notyf({ dismissible: true, duration: 2000 });
            notyfE.error("Need atleast one Tag");
        } else tag.remove();
    };

    const addLink = () => {
        const link = document.querySelector(".link");
        const clone = link.cloneNode(true);

        clone.querySelector("input").value = "";
        clone
            .querySelector(".btn-danger")
            .addEventListener("click", (eve) => removeLink(eve));

        document.querySelector(".links").appendChild(clone);
    };
    const addTag = () => {
        const tag = document.querySelector(".tag");
        const clone = tag.cloneNode(true);

        clone.querySelector("input").value = "";
        clone
            .querySelector(".btn-danger")
            .addEventListener("click", (eve) => removeTag(eve));

        document.querySelector(".tags").appendChild(clone);
    };

    useEffect(() => {
        try {
            fetchEvents();
        } catch (err) {
            console.log(err);
            let notyfE = new Notyf({ dismissible: true, duration: 2000 });
            notyfE.error("Some error has occurred");
        }
    }, []);

    const checkForm = (e) => {
        const inp = e.target;
        const name = inp.getAttribute("name");

        if (name === "name") {
            if (inp.value.length < 3) {
                inp.classList.remove("input-fine");
                inp.classList.add("input-danger");
            } else {
                inp.classList.remove("input-danger");
                inp.classList.add("input-fine");
            }
        }

        if (name === "description") {
            if (inp.value === "") {
                inp.classList.remove("input-fine");
                inp.classList.add("input-danger");
            } else {
                inp.classList.remove("input-danger");
                inp.classList.add("input-fine");
            }
        }
    };

    const submitForm = async () => {
        const fields = document.querySelectorAll(".req-inp");
        let confirmSubmit = true;
        let body = {};
        let links = [];
        let tags = [];
        let notyf = new Notyf({ dismissible: true, duration: 2000 });
        let errorText = "Please fill all the fields";

        body["online"] = online;

        for (let field of fields) {
            if (field.value === "") {
                confirmSubmit = false;
            } else {
                body[field.getAttribute("name")] = field.value;
            }
        }

        for (let link of document.querySelectorAll(".link input")) {
            if (link.value !== "") {
                links.push(link.value);
            }
        }
        for (let tag of document.querySelectorAll(".tag input")) {
            if (tag.value !== "") {
                tags.push(tag.value);
            }
        }
        body["tags"] = tags;
        body["links"] = links;

        if (links.length === 0 || tags.length === 0) {
            confirmSubmit = false;
        }

        if (document.querySelector(".input-danger")) {
            errorText = "Name should be more than 3 letters";
            confirmSubmit = false;
        } else {
            errorText = "Please fill all the fields";
        }

        if (document.querySelector("input[name='endDate']").value) {
            body["endDate"] = document.querySelector(
                "input[name='endDate']"
            ).value;
        }

        if (confirmSubmit) {
            const createdEventJson = await fetch(
                `${BASE_API_URL}/events/create?access_token=${localStorage.getItem(
                    "auth-token"
                )}`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: { "Content-Type": "application/json" },
                }
            );
            const createdEvent = await createdEventJson.json();

            console.log(createdEvent);

            if (createdEvent.done) {
                setCreateView(false);
                fetchEvents();
            } else {
                notyf.error("Some error occurred");
            }
        } else {
            notyf.error(errorText);
        }
    };

    const deleteEvent = async (eventId, org) => {
        if (org === id) {
            const delMsgJson = await fetch(
                `${BASE_API_URL}/events/delete/${eventId}?access_token=${localStorage.getItem(
                    "auth-token"
                )}`,
                { method: "DELETE" }
            );
            const delMsg = await delMsgJson.json();

            if (delMsg.done) {
                fetchEvents();
            } else {
                let notyf = new Notyf({ dismissible: true, duration: 2000 });
                notyf.error("Some error occurred");
            }
        }
    };

    return (
        <>
            <div
                className="container"
                style={{ marginTop: "5vh", paddingBottom: "10vh" }}
            >
                {org ? (
                    <button
                        className="btn btn-primary"
                        style={{ marginBottom: "5vh" }}
                        onClick={() => setCreateView(!createView)}
                    >
                        {createView ? "Explore Events" : "Organize Event"}
                    </button>
                ) : (
                    ""
                )}
                {!createView ? (
                    <div className="events">
                        {events.map((event) => {
                            return (
                                <div
                                    className="card"
                                    key={event._id}
                                    style={{ width: "18rem" }}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">
                                            {event.name}
                                        </h5>
                                        <h6 className="card-subtitle mb-2 text-muted">
                                            {event.date}
                                        </h6>
                                        <p className="card-text">
                                            {event.description}
                                            <br />
                                            <div className="tags mt-4 mb-3">
                                                {event.tags.map((tag) => {
                                                    return (
                                                        <span
                                                            className="badge bg-primary"
                                                            style={{
                                                                marginRight:
                                                                    "0.5em",
                                                            }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </p>
                                        {event.links.map((link) => {
                                            return (
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="card-link btn btn-primary mt-4 mb-3"
                                                >
                                                    <FaLink />
                                                </a>
                                            );
                                        })}
                                    </div>
                                    {id === event.org ? (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => {
                                                deleteEvent(
                                                    event._id,
                                                    event.org
                                                );
                                            }}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    ""
                )}

                {createView ? (
                    <div className="form">
                        <div className="col-4 mb-3">
                            <label htmlFor="name" className="form-label reqd">
                                Event Name
                            </label>
                            <input
                                type="text"
                                className="form-control req-inp"
                                id="name"
                                name="name"
                                onKeyUp={(eve) => checkForm(eve)}
                                placeholder="eg. Code Wars Hackathon"
                            />
                        </div>
                        <div className="col-4 mb-3">
                            <label
                                htmlFor="description"
                                className="form-label reqd"
                            >
                                Description
                            </label>
                            <textarea
                                className="form-control req-inp"
                                id="description"
                                name="description"
                                rows="3"
                                onKeyUp={(eve) => checkForm(eve)}
                                placeholder="Describe your event in 20-30 words"
                            ></textarea>
                        </div>
                        <div className="row">
                            <div className="col-2 mb-3">
                                <label
                                    htmlFor="startDate"
                                    className="form-label reqd"
                                >
                                    Event Starts
                                </label>
                                <input
                                    type="date"
                                    className="form-control req-inp"
                                    id="startDate"
                                    name="startDate"
                                    placeholder="eg. Code Wars Hackathon"
                                    min={getToday()}
                                    max={getToday(true)}
                                />
                            </div>
                            <div className="col-2 mb-3">
                                <label htmlFor="endDate" className="form-label">
                                    Event Ends
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="endDate"
                                    name="endDate"
                                    placeholder="eg. Code Wars Hackathon"
                                    min={getToday()}
                                    max={getToday(true)}
                                />
                            </div>
                        </div>

                        <label htmlFor="link" className="form-label reqd">
                            Event Links
                        </label>
                        <div className="col-4 mb-3 links">
                            <div className="mb-3 link">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="link"
                                    name="link"
                                    placeholder="eg. https://domain.com/"
                                />
                                <button
                                    className="btn btn-danger"
                                    onClick={(eve) => removeLink(eve)}
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary mb-4"
                            onClick={addLink}
                        >
                            <FaPlus />
                        </button>
                        <br />
                        <label htmlFor="tag" className="form-label reqd">
                            Event Tags
                        </label>
                        <div className="col-4 mb-3 tags">
                            <div className="mb-3 tag">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tag"
                                    name="tag"
                                    placeholder="eg. Event Website"
                                />
                                <button
                                    className="btn btn-danger"
                                    onClick={(eve) => removeTag(eve)}
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary mb-4"
                            onClick={addTag}
                        >
                            <FaPlus />
                        </button>
                        <br />
                        <div className="form-check form-switch col-4 mb-3">
                            <label
                                className="form-check-label"
                                htmlFor="online"
                            >
                                Is this Event online?
                            </label>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                name="online"
                                role="switch"
                                onClick={() => setOnline(!online)}
                            />
                        </div>
                        <br />
                        <br />
                        <button
                            className="btn btn-primary col-4"
                            id="create-event"
                            onClick={submitForm}
                        >
                            Create Event
                        </button>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </>
    );
};

export default Events;
