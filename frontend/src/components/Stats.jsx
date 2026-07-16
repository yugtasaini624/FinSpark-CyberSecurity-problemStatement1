import "./../css/stats.css";

function Stats() {
  return (
    <section className="stats section">

      <div className="container stats-grid">

        <div className="stat-card">
          <h2>99.6%</h2>
          <p>Threat Detection Accuracy</p>
        </div>

        <div className="stat-card">
          <h2>24×7</h2>
          <p>Continuous Monitoring</p>
        </div>

        <div className="stat-card">
          <h2>5000+</h2>
          <p>Activities Analysed Daily</p>
        </div>

        <div className="stat-card">
          <h2>&lt;1 Sec</h2>
          <p>Risk Detection Time</p>
        </div>

      </div>

    </section>
  );
}

export default Stats;