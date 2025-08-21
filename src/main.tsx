import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import FieldTechDashboard from "./pages/field-tech/FieldTechDashboard";
import theme from "./theme";
import JobDetails from "./pages/field-tech/JobDetails";
import LandingPage from "./pages/LandingPage";
import LabAdminDashboard from "./pages/lab-admin/LabAdminDashboard";
import LabAdminCreateJob from "./pages/lab-admin/LabAdminCreateJob";
import LabAdminAddProctor from "./pages/lab-admin/LabAdminAddProctor";
import DistributionListManagerDemo from "./pages/lab-admin/DistributionListManagerDemo";
import "./index.css";
import ReportDetails from "./pages/field-tech/ReportDetails";

// PWA service worker registration is handled automatically by vite-plugin-pwa

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/field-tech" element={<FieldTechDashboard />} />
          <Route path="/lab-admin" element={<LabAdminDashboard />} />
          <Route path="/lab-admin/create-job" element={<LabAdminCreateJob />} />
          <Route
            path="/lab-admin/add-proctor"
            element={<LabAdminAddProctor />}
          />
          <Route
            path="/distribution-list-manager-demo"
            element={<DistributionListManagerDemo />}
          />
          <Route path="/job/:jobId" element={<JobDetails />} />
          <Route
            path="/job/:jobId/report/:reportId"
            element={<ReportDetails />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
