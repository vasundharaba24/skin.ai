import React, { useState, useEffect } from 'react';
import './DocDashboard.css';
import EditDocDetails from './EditDocDetails';
import { Link } from 'react-router-dom';

function DocDashboard() {
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const navTabs = document.querySelectorAll("#nav-tabs > a");
        navTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                navTabs.forEach((tab) => {
                    tab.classList.remove("active");
                });
                tab.classList.add("active");
            });
        });
        // Clean up the event listeners
        return () => {
            navTabs.forEach((tab) => {
                tab.removeEventListener("click", () => {});
            });
        };
    }, []);

    const handleNavClick = (e) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('href');
        if (id === "#upload-products") {
            setShowForm(true);
        } else {
            setShowForm(false);
        }
    };

    const handleBackClick = () => {
        setShowForm(false);
    };

    return (
        <div className='admin'>
            <div className="site-wrap">
                <nav className="site-nav">
                    <div className="name">
                        Skin.ai
                        <svg width={24} height={24} viewBox="0 0 24 24">
                            <path d="M11.5,22C11.64,22 11.77,22 11.9,21.96C12.55,21.82 13.09,21.38 13.34,20.78C13.44,20.54 13.5,20.27 13.5,20H9.5A2,2 0 0,0 11.5,22M18,10.5C18,7.43 15.86,4.86 13,4.18V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V4.18C7.13,4.86 5,7.43 5,10.5V16L3,18V19H20V18L18,16M19.97,10H21.97C21.82,6.79 20.24,3.97 17.85,2.15L16.42,3.58C18.46,5 19.82,7.35 19.97,10M6.58,3.58L5.15,2.15C2.76,3.97 1.18,6.79 1,10H3C3.18,7.35 4.54,5 6.58,3.58Z" />
                        </svg>
                    </div>
                    <ul>
                        <li className={showForm ? "" : "active"}>
                            <a href="#upload-products" onClick={handleNavClick}>Edit Details</a>
                        </li>
                    </ul>
                    <div className={`note ${showForm ? "hidden" : ""}`}>
                        <h3>Your Monthly Report</h3>
                        <p>Get the info about all your deals, pros, cons. And build your roadmap.</p>
                    </div>
                </nav>
                <main>
                    {showForm ? (
                        <>
                            <button className='btn' onClick={handleBackClick}>Back</button>
                            <EditDocDetails />
                        </>
                    ) : (
                        <>
                            <header>
                                <div className="breadcrumbs">
                                   <Link to={"/"}> <a href="#0/">Home</a></Link>
                                </div>
                                <h1 className="title">Skin.ai</h1>
                                <nav className="nav-tabs" id="nav-tabs">
                                    <a href="#0" className="active">
                                    My Appointments
                                        <span>14</span>
                                    </a>
                                   
                                </nav>
                            </header>
                            <div className="content-columns">
                                <div className="col">
                                    <div className="item">
                                        <p>Hello</p>
                                    </div>
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                </div>
                                <div className="col">
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                </div>
                                <div className="col">
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                </div>
                                <div className="col">
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                    <div className="item" />
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default DocDashboard;
