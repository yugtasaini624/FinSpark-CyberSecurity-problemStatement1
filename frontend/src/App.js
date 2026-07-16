import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/employee-dashboard"
        element={<EmployeeDashboard />}
      />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />
    </Routes>
  );
}

export default App;

// Email:
// admin@aegisvault.com

// Password:
// Admin@123