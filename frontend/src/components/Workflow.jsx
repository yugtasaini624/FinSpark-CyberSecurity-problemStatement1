import "./../css/workflow.css";

const steps = [
  "Employee Login",
  "Activity Monitoring",
  "Behavior Analysis",
  "Risk Score Generation",
  "Evidence Collection",
  "Manager Approval",
  "Secure Banking System"
];

function Workflow() {
  return (
    <section className="workflow section" id="workflow">

      <div className="container">

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>AI Security Workflow</h2>

          <p>
            Every employee activity passes through our intelligent
            security pipeline before sensitive banking operations are allowed.
          </p>

        </div>

        <div className="workflow-container">

          {steps.map((step, index) => (

            <div className="workflow-item" key={index}>

              <div className="circle">
                {index + 1}
              </div>

              <h3>{step}</h3>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Workflow;