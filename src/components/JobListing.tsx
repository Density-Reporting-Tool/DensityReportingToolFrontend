import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { JobReadDTO } from "@/dtos/Job/job";
import { apiService } from "@/services/apiService";

interface JobListingProps {
  onJobClick?: (job: JobReadDTO) => void;
}

const JobListing: React.FC<JobListingProps> = ({ onJobClick }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobReadDTO[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get<JobReadDTO[]>("/api/jobs");
      if (response.data) {
        // Sort by creation date (newest first) - assuming jobs have an id that increases with time
        const sortedJobs = response.data.sort((a, b) => b.id - a.id);
        setJobs(sortedJobs);
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter(job => 
      job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleJobClick = (job: JobReadDTO) => {
    if (onJobClick) {
      onJobClick(job);
    } else {
      // Navigate to field tech dashboard job details page
      navigate(`/field-tech/job/${job.jobNumber}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getProjectManagerName = (job: JobReadDTO) => {
    if (job.projectManagers && job.projectManagers.length > 0) {
      const activeManager = job.projectManagers.find(pm => pm.isActive);
      if (activeManager) {
        return activeManager.fullName;
      }
      return job.projectManagers[0].fullName;
    }
    return "Not assigned";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Please check your connection and try again.
        </Typography>
      </Box>
    );
  }

  if (jobs.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <WorkIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No jobs found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first job to get started.
        </Typography>
      </Box>
    );
  }

  if (filteredJobs.length === 0 && searchTerm) {
    return (
      <Box sx={{ p: 3 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search jobs by job number (e.g., 200, 24501, 29102)"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* No Results */}
        <Box sx={{ textAlign: "center", py: 4 }}>
          <WorkIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No jobs found matching "{searchTerm}"
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try a different search term or clear the search to see all jobs.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search jobs by job number (e.g., 200, 24501, 29102)"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {searchTerm ? `Search Results (${filteredJobs.length})` : `All Jobs (${jobs.length})`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sorted by newest first
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardActionArea
                onClick={() => handleJobClick(job)}
                sx={{ height: "100%", display: "flex", flexDirection: "column" }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Job Number and Status */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                      {job.jobNumber}
                    </Typography>
                    <Chip
                      label={job.endDate ? "Completed" : "Active"}
                      color={job.endDate ? "success" : "primary"}
                      size="small"
                    />
                  </Box>

                  {/* Project Name */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                    {job.projectName}
                  </Typography>

                  {/* Client */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <BusinessIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.clientName}
                    </Typography>
                  </Box>

                  {/* Project Manager */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <PersonIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {getProjectManagerName(job)}
                    </Typography>
                  </Box>

                  {/* Location */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <LocationIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {job.siteAddress}
                    </Typography>
                  </Box>

                  {/* Dates */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Start: {formatDate(job.startDate)}
                    </Typography>
                  </Box>

                  {job.endDate && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                      <CalendarIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        End: {formatDate(job.endDate)}
                      </Typography>
                    </Box>
                  )}

                  {/* Reports Count */}
                  {job.reports && job.reports.length > 0 && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
                      <Typography variant="caption" color="text.secondary">
                        {job.reports.length} report{job.reports.length !== 1 ? "s" : ""}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default JobListing;
