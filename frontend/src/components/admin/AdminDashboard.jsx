import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import KPICards from "./components/KPICards";
import EmployeeList from "../admin/components/EmployeeList";
import RiskMeter from "./components/RiskMeter";
import Timeline from "./components/Timeline";
import EvidenceGallery from "./components/EvidenceGallery";
import AIInvestigation from "./components/AIInvestigation";
import ApprovalCard from "./components/ApprovalCard";

import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">

      <Navbar />

      <motion.main
        className="dashboard-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >

        <section className="dashboard-header">
          <h1>AegisVault AI Security Dashboard</h1>
          <p>
            AI-powered employee risk monitoring and investigation system
          </p>
        </section>


        <KPICards />


        <div className="dashboard-grid">

          <EmployeeList />

          <RiskMeter />

          <Timeline />

          <EvidenceGallery />

          <AIInvestigation />

          <ApprovalCard />

        </div>

      </motion.main>

    </div>
  );
}

export default AdminDashboard;