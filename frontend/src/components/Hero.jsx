import "./../css/landing.css";
import { Link } from "react-router-dom";

import {
    FaBrain,
    FaVideo,
    FaRobot,
    FaLock
} from "react-icons/fa";

function Hero() {

    return (

        <section className="hero">

            <div className="container hero-container">

                <div className="hero-left">

                    <span className="badge">
                        AI Powered Banking Security
                    </span>

                    <h1>

                        Detect Insider Threats

                        <br/>

                        Before They Become

                        <span> Breaches.</span>

                    </h1>

                    <p>

                        AegisVault AI continuously monitors employee
                        behaviour, detects anomalies, collects evidence,
                        calculates risk scores and protects critical
                        banking systems in real time.

                    </p>

                    <div className="hero-buttons">

                        <Link to="/login">
                            <button className="primary-btn">
                                Launch Platform
                            </button>
                        </Link>

                        <button className="secondary-btn">
                            Learn More
                        </button>

                    </div>

                    <div className="hero-features">

                        <div><FaBrain/> Behaviour AI</div>

                        <div><FaVideo/> Evidence Capture</div>

                        <div><FaRobot/> AI Incident Analysis</div>

                        <div><FaLock/> Adaptive Session Lock</div>

                    </div>

                </div>

                <div className="hero-right">

                    <div className="dashboard-card">

                        <h3>Security Operations Center</h3>

                        <div className="stat">

                            <span>Employees Online</span>

                            <strong>26</strong>

                        </div>

                        <div className="stat">

                            <span>Threat Score</span>

                            <strong className="danger">72</strong>

                        </div>

                        <div className="stat">

                            <span>Live Alerts</span>

                            <strong>3</strong>

                        </div>

                        <div className="stat">

                            <span>Evidence Captured</span>

                            <strong>18</strong>

                        </div>

                        <div className="timeline">

                            <p>10:42 PM • Rahul exported customer data</p>

                            <p>10:45 PM • AI generated High Risk Alert</p>

                            <p>10:47 PM • Manager Approval Required</p>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default Hero;