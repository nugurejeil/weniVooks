import { useState } from "react";

function About() {
    return <p>Weniv 입니다.</p>;
}

function Profile() {
    return <p>Profile 입니다.</p>;
}

function Contact() {
    return <p>Contact 입니다.</p>;
}

function File011() {
    const [page, setPage] = useState("one");
    return (
        <nav>
            <button onClick={() => setPage("about")}>About</button>
            <button onClick={() => setPage("profile")}>Profile</button>
            <button onClick={() => setPage("contact")}>Contact</button>
            {page === "about" && <About />}
            {page === "profile" && <Profile />}
            {page === "contact" && <Contact />}
        </nav>
    );
}

export default File011;