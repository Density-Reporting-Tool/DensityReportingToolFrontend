import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import FieldTechDashboard from "./pages/field-tech/FieldTechDashboard";
import theme from "./theme";
import JobDetails from "./pages/field-tech/JobDetails";
import AllDensityShots from "./pages/field-tech/AllDensityShots";
import AllReports from "./pages/field-tech/AllReports";
import AllProctors from "./pages/field-tech/AllProctors";
import LandingPage from "./pages/LandingPage";
import LabAdminDashboard from "./pages/lab-admin/LabAdminDashboard";
import LabAdminCreateJob from "./pages/lab-admin/LabAdminCreateJob";
import LabAdminAddProctor from "./pages/lab-admin/LabAdminAddProctor";
import DistributionListManagerDemo from "./pages/lab-admin/DistributionListManagerDemo";
import "./index.css";
import ReportDetails from "./pages/field-tech/ReportDetails";
import AddDensityTest from "./pages/field-tech/AddDensityTest";
import AllPhotos from "./pages/field-tech/AllPhotos";

// PWA service worker registration is handled automatically by vite-plugin-pwa

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Field tech pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/field-tech/" element={<FieldTechDashboard />} />
          <Route path="/field-tech/job/:jobId" element={<JobDetails />} />
          <Route
            path="/field-tech/job/:jobId/report/:reportId"
            element={<ReportDetails />}
          />
          <Route
            path="/field-tech/add-density-test"
            element={<AddDensityTest />}
          />

          {/* Lab admin pages */}
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
          <Route
            path="/job/:jobId/report/:reportId/all-density-shots"
            element={<AllDensityShots />}
          />
          <Route path="/job/:jobId/all-reports" element={<AllReports />} />
          <Route
            path="/job/:jobId/report/:reportId/all-photos"
            element={<AllPhotos />}
          />
          <Route path="/job/:jobId/all-proctors" element={<AllProctors />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
