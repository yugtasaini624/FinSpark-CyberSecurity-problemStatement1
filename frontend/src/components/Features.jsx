import "./../css/features.css";

import {
  FaBrain,
  FaCamera,
  FaRobot,
  FaLock,
  FaUserShield
} from "react-icons/fa";

const features = [
  {
    icon: <FaBrain />,
    title: "Sentinel AI",
    desc: "Learns employee behaviour patterns and detects unusual activities in real time before they become security incidents."
  },
  {
    icon: <FaCamera />,
    title: "Vision AI",
    desc: "Captures screenshots and activity evidence whenever suspicious operations are detected for future investigation."
  },
  {
    icon: <FaRobot />,
    title: "Analyst AI",
    desc: "Explains every alert with AI-generated reasoning so administrators understand exactly why the risk occurred."
  },
  {
    icon: <FaLock />,
    title: "Guardian AI",
    desc: "Automatically locks high-risk sessions and requests manager approval before critical operations continue."
  },
  {
    icon: <FaUserShield />,
    title: "Vault AI",
    desc: "Verifies whether employees are authorized to perform sensitive banking operations before execution."
  }
];

function Features() {
  return (
    <section className="features section" id="features">

      <div className="container">

        <div className="section-heading">

          <span>OUR AI MODULES</span>

          <h2>Five Intelligent Security Engines</h2>

          <p>
            Every module works together to detect insider threats,
            collect evidence, explain risks and protect banking systems.
          </p>

        </div>

        <div className="feature-grid">

          {features.map((item, index) => (

            <div className="feature-card" key={index}>

              <div className="feature-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Features;