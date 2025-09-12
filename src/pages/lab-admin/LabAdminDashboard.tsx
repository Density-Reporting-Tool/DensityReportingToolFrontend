import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  Card,
  CardContent,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon2,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { apiService } from "../../services/apiService";

// Types for job data
interface Job {
  id: number;
  jobNumber: string;
  clientName: string;
  projectName: string;
  siteAddress: string;
  startDate: string | null;
  endDate: string | null;
  projectManagers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }>;
  siteContacts: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    company: string;
    role: string;
    isPrimary: boolean;
  }>;
  jobNotes: Array<{
    id: number;
    note: string;
    createdDate: string;
  }>;
}

const LabAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string>("schedule"); // Default to schedule view
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNavigation = (section: string) => {
    setSelectedSection(section);
  };

  const handleCreateJob = () => {
    navigate("/lab-admin/create-job");
  };

  const handleEnterProctor = () => {
    navigate("/lab-admin/add-proctor");
  };

  // Fetch jobs when component mounts or when schedule section is selected
  useEffect(() => {
    if (selectedSection === "schedule") {
      fetchJobs();
    }
  }, [selectedSection]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllJobs();
      setJobs(response.data || []);
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (job: Job) => {
    if (!job.startDate) return "default";
    const startDate = new Date(job.startDate);
    const today = new Date();
    const diffDays = Math.ceil(
      (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return "error"; // Past due
    if (diffDays <= 7) return "warning"; // Due soon
    return "success"; // Future
  };

  const getStatusText = (job: Job) => {
    if (!job.startDate) return "No start date";
    const startDate = new Date(job.startDate);
    const today = new Date();
    const diffDays = Math.ceil(
      (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return "Past due";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `In ${diffDays} days`;
    return "Scheduled";
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "schedule":
        return (
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Field Tech Schedule
              </Typography>
              <Button
                variant="outlined"
                onClick={fetchJobs}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <ScheduleIcon />
                }
              >
                Refresh
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : jobs.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <WorkIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No jobs scheduled
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Jobs will appear here once they are created
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {jobs.map((job) => (
                  <Grid item xs={12} md={6} lg={4} key={job.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => navigate(`/job/${job.jobNumber}`)}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "primary.main" }}
                          >
                            {job.jobNumber}
                          </Typography>
                          <Chip
                            label={getStatusText(job)}
                            color={getStatusColor(job) as any}
                            size="small"
                          />
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          {job.projectName}
                        </Typography>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <BusinessIcon
                            sx={{
                              fontSize: 16,
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {job.clientName}
                          </Typography>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <LocationIcon
                            sx={{
                              fontSize: 16,
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ flex: 1 }}
                          >
                            {job.siteAddress}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            Project Manager
                          </Typography>
                          {job.projectManagers.length > 0 ? (
                            job.projectManagers.map((pm) => (
                              <Box
                                key={pm.id}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 0.5,
                                }}
                              >
                                <PersonIcon2
                                  sx={{
                                    fontSize: 16,
                                    mr: 1,
                                    color: "text.secondary",
                                  }}
                                />
                                <Typography variant="body2">
                                  {pm.firstName} {pm.lastName}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No project manager assigned
                            </Typography>
                          )}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Start: {formatDate(job.startDate)}
                            </Typography>
                            {job.endDate && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block" }}
                              >
                                End: {formatDate(job.endDate)}
                              </Typography>
                            )}
                          </Box>
                          <CalendarIcon
                            sx={{ fontSize: 20, color: "text.secondary" }}
                          />
                        </Box>

                        {job.jobNotes.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              Notes
                            </Typography>
                            {job.jobNotes.slice(0, 2).map((note) => (
                              <Typography
                                key={note.id}
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontSize: "0.75rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {note.note}
                              </Typography>
                            ))}
                            {job.jobNotes.length > 2 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                +{job.jobNotes.length - 2} more notes
                              </Typography>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );
      case "createJob":
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Create Job
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Job creation form will appear here.
            </Typography>
          </Box>
        );
      case "enterProctor":
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Enter Proctor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Proctor entry form will appear here.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
            }}
          >
            <Typography variant="h6">
              Select an option from the sidebar to get started
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header Bar */}
      <Box
        sx={{
          height: 64,
          backgroundColor: "primary.main",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Title Section */}
        <Box
          sx={{
            backgroundColor: "primary.dark",
            height: "100%",
            display: "flex",
            alignItems: "center",
            px: 3,
            minWidth: 200,
          }}
        >
          {/* Avatar Circle */}
          <Avatar
            sx={{
              bgcolor: "white",
              color: "primary.main",
              fontWeight: "bold",
              fontSize: "1.2rem",
              width: 40,
              height: 40,
              mr: 2,
            }}
          >
            LA
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            Lab Admin
          </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Left Sidebar */}
        <Box
          sx={{
            width: 200,
            backgroundColor: "grey.100",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
          }}
        >
          <Stack spacing={2} sx={{ width: "90%" }}>
            {/* Schedule Button */}
            <Button
              variant="contained"
              onClick={() => handleNavigation("schedule")}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              startIcon={<ScheduleIcon />}
            >
              Schedule
            </Button>

            {/* Create Job Button */}
            <Button
              variant="contained"
              onClick={handleCreateJob}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              startIcon={<AddIcon />}
            >
              Create Job
            </Button>

            {/* Enter Proctor Button */}
            <Button
              variant="contained"
              onClick={handleEnterProctor}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              startIcon={<PersonIcon />}
            >
              Enter Proctor
            </Button>
          </Stack>
        </Box>

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "background.default",
            borderLeft: "1px solid grey.300",
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default LabAdminDashboard;
