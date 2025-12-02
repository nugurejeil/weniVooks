import React, { useState } from "react";

const Menu = () => {
    const [page, setPage] = useState("");

    function About() {
        return (
            <>
                <button onClick={() => setPage("About")}>About</button>
            </>
        );
    }
    function Profile() {
        return (
            <>
                <button onClick={() => setPage("Profile")}>Profile</button>
            </>
        );
    }
    function Contact() {
        return (
            <>
                <button onClick={() => setPage("Contact")}>Contact</button>
            </>
        );
    }

    function Contents({ page }) {
        if (page === "About") {
            return <>About Page</>;
        } else if (page === "Profile") {
            return <>Profile Page</>;
        } else if (page === "Contact") {
            return <>Contact Page</>;
        }
        return <>About Page</>;
    }

    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <About />
                        </li>
                        <li>
                            <Profile />
                        </li>
                        <li>
                            <Contact />
                        </li>
                    </ul>
                </nav>
            </header>

            <Contents page={page} />
        </div>
    );
};

export default Menu;