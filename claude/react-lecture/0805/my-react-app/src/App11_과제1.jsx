import { useState } from "react";

function About() {
    return <p>About</p>;
}

function Profile() {
    return <p>Profile</p>;
}

function Contact() {
    return <p>Contact</p>;
}

function App() {
    const [page, setPage] = useState("About");

    function Content() {
        return (
            <nav>
                <ul>
                    <li>
                        <button onClick={() => setPage("About")}>About</button>
                    </li>
                    <li>
                        <button onClick={() => setPage("Profile")}>Profile</button>
                    </li>
                    <li>
                        <button onClick={() => setPage("Contact")}>Contact</button>
                    </li>
                </ul>
            </nav>
        );
    }
    return (
        <>
            <Content />
            {page === "About" ? (
                <About />
            ) : page === "Profile" ? (
                <Profile />
            ) : page === "Contact" ? (
                <Contact />
            ) : (
                <About />
            )}
        </>
    );
}

export default App;