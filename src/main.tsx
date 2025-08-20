import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import theme from "./theme";
import JobDetails from "./pages/JobDetails";
import LandingPage from "./pages/LandingPage";
import LabAdminDashboard from "./pages/LabAdminDashboard";
import LabAdminCreateJob from "./pages/LabAdminCreateJob";
import LabAdminAddProctor from "./pages/LabAdminAddProctor";
import DistributionListManagerDemo from "./pages/DistributionListManagerDemo";
import "./index.css";

// Register PWA service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/lab-admin" element={<LabAdminDashboard />} />
        <Route path="/lab-admin/create-job" element={<LabAdminCreateJob />} />
        <Route path="/lab-admin/add-proctor" element={<LabAdminAddProctor />} />
        <Route path="/distribution-list-manager-demo" element={<DistributionListManagerDemo />} />
          <Route path="/job/:id" element={<JobDetails />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
