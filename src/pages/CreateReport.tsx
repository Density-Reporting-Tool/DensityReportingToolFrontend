import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  CameraAlt as CameraAltIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import HeaderTitle from "@/components/headers/HeaderTitle";
import BottomNavBar from "@/components/navbar/BottomNavBar";
import SolidBackgroundColorButton from "@/components/button/SolidBackgroundColorButton";
import { apiService } from "../services/apiService";

// Types
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface JobData {
  id: number;
  jobNumber: string;
  clientName: string;
  projectName: string;
  siteAddress: string;
}

const CreateReport: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedReviewerId, setSelectedReviewerId] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [conclusion, setConclusion] = useState<string>("");
  const [densityTests, setDensityTests] = useState<any[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(true);

  // Check if form was already filled out (from navigation state or existing data)
  useEffect(() => {
    if (selectedEmployeeId && selectedReviewerId && selectedEmployeeId !== "" && selectedReviewerId !== "") {
      setShowAssignmentForm(false);
    }
  }, [selectedEmployeeId, selectedReviewerId]);

  // Fetch job data and employees on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch job data
        const jobResponse = await apiService.getJob(jobId);
        setJobData(jobResponse.data);
        
        // Fetch employees for dropdowns
        const employeesResponse = await apiService.getEmployees();
        setEmployees(employeesResponse.data || []);
        
        // No need to set dates - they're handled automatically
        
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  // Handle navigation data from AddDensityTest page
  useEffect(() => {
    if (location.state?.densityTest) {
      const newDensityTest = {
        ...location.state.densityTest,
        id: Date.now(), // Temporary ID for display
        selectedProctor: location.state.selectedProctor
      };
      setDensityTests(prev => [...prev, newDensityTest]);
      
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSaveReport = async () => {
    if (!jobId || !selectedEmployeeId || !selectedReviewerId || !jobData) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const reportData = {
        jobId: jobData.id, // Use the actual job ID from the job data
        employeeId: parseInt(selectedEmployeeId),
        reviewerId: parseInt(selectedReviewerId),
        startDate: new Date(), // Always set to current time when creating
        submitDate: null, // Will be set when report is submitted
        distributeDate: null, // Will be set when report is distributed
        memo: {
          purpose: purpose,
          commentsAndObservations: comments,
          conclusion: conclusion
        }
      };

      const response = await apiService.createReport(reportData);
      
      console.log("Report created successfully:", response.data);
      setSuccess(true);
      
      // Navigate to the created report after a short delay
      setTimeout(() => {
        navigate(`/job/${jobId}/report/${response.data.id}`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error creating report:', err);
      setError(err.message || 'Failed to create report');
    } finally {
      setSaving(false);
    }
  };

  const handleNewDensityShot = () => {
    if (jobId) {
      navigate(`/job/${jobId}/add-density-test`);
    }
  };

  const handleTakePhoto = () => {
    console.log("Take photo");
    // TODO: Implement photo capture
  };

  const handleUploadImage = () => {
    console.log("Upload image");
    // TODO: Implement image upload
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !jobData) {
    return (
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate(-1)} variant="outlined">
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobData?.jobNumber || jobId}`}
        subtitle="Create New Report"
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Report created successfully! Redirecting to report details...
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Report Assignment Section - Only show if not assigned yet */}
        {showAssignmentForm && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Report Assignment
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Employee (Reporter)</InputLabel>
                <Select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  label="Employee (Reporter)"
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id.toString()}>
                      {employee.firstName} {employee.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Reviewer</InputLabel>
                <Select
                  value={selectedReviewerId}
                  onChange={(e) => setSelectedReviewerId(e.target.value)}
                  label="Reviewer"
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id.toString()}>
                      {employee.firstName} {employee.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              onClick={() => setShowAssignmentForm(false)}
              disabled={!selectedEmployeeId || !selectedReviewerId || selectedEmployeeId === "" || selectedReviewerId === ""}
              sx={{ mb: 2 }}
            >
              Assign Report
            </Button>
          </Card>
        )}

        {/* Main Report Content - Only show after assignment */}
        {!showAssignmentForm && (
          <Stack gap={3}>
            {/* Density Test Section */}
            <Box id="densityTestSection">
              <HeaderTitle
                title="Density Tests"
                showAll={true}
                onClick={() => console.log("Show all density tests")}
              />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: 2,
              }}
            >
              {densityTests.length > 0 ? (
                densityTests.map((test, index) => (
                  <Accordion key={test.id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`density-test-${test.id}-content`}
                      id={`density-test-${test.id}-header`}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                        <Typography variant="body1" fontWeight="700">
                          Density Test {index + 1}
                        </Typography>
                        <Typography
                          color={test.densityValue > 0 && test.compactionSpecification ? 
                            (test.densityValue >= test.compactionSpecification ? "success.main" : "error.main") : 
                            "text.secondary"
                          }
                        >
                          {test.densityValue > 0 && test.compactionSpecification ? 
                            (test.densityValue >= test.compactionSpecification ? "PASS" : "FAIL") : 
                            "PENDING"
                          }
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">
                          <strong>Location:</strong> {test.location || 'Not specified'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Test Area:</strong> {test.testArea || 'Not specified'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Proctor:</strong> {test.selectedProctor?.proctorID || 'Unknown'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Compaction Spec:</strong> {test.compactionSpecification}% {test.compactionSpecificationUnit}
                        </Typography>
                        {test.densityValue > 0 && (
                          <Typography variant="body2">
                            <strong>Density:</strong> {test.densityValue}
                          </Typography>
                        )}
                        {test.moistureValue > 0 && (
                          <Typography variant="body2">
                            <strong>Moisture:</strong> {test.moistureValue}%
                          </Typography>
                        )}
                        <Typography variant="body2">
                          <strong>Elevation:</strong> {test.elevationValue ? `${test.elevationValue} ${test.elevationUnit}` : 'Not specified'}
                        </Typography>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Card sx={{ padding: 2, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No density tests added yet. Click "Add Density Test" to add one.
                  </Typography>
                </Card>
              )}
            </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <SolidBackgroundColorButton
                  icon={<AddIcon sx={{ fontSize: "1.25rem" }} />}
                  handleClick={() => handleNewDensityShot()}
                >
                  Add Density Test
                </SolidBackgroundColorButton>
              </Box>
            </Box>

            {/* Report Content Section */}
            <Box id="reportMemoSection">
              <Typography variant="h5" sx={{ mb: 1 }}>
                Report
              </Typography>
              <Stack
                sx={{
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "lightgrey",
                }}
              >
                <Box>
                  <TextField
                    id="report-purpose"
                    label="Purpose"
                    multiline
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    sx={{ backgroundColor: "white" }}
                    minRows={2}
                    fullWidth
                  />
                </Box>
                <Box>
                  <TextField
                    id="report-comment-observations"
                    label="Comments / observations"
                    multiline
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    sx={{ backgroundColor: "white" }}
                    minRows={5}
                    fullWidth
                  />
                </Box>
                <Box>
                  <TextField
                    id="report-conclusion"
                    label="Conclusion"
                    multiline
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    sx={{ backgroundColor: "white" }}
                    minRows={2}
                    fullWidth
                  />
                </Box>
              </Stack>
            </Box>

            {/* Report Photos Section */}
            <Box id="reportPhotos">
              <HeaderTitle title="Report Photos" onClick={() => console.log("Show all photos")} />
              <Card sx={{ padding: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No photos added yet. Add photos after creating the report.
                </Typography>
              </Card>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  m: 2,
                }}
              >
                <Box
                  sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}
                >
                  <SolidBackgroundColorButton
                    icon={<FileUploadIcon sx={{ fontSize: "1.25rem" }} />}
                    handleClick={() => handleUploadImage()}
                  >
                    Upload Image
                  </SolidBackgroundColorButton>
                  <SolidBackgroundColorButton
                    icon={<CameraAltIcon sx={{ fontSize: "1.25rem" }} />}
                    handleClick={() => handleTakePhoto()}
                  >
                    Take Photo
                  </SolidBackgroundColorButton>
                </Box>
                <SolidBackgroundColorButton
                  icon={<CameraAltIcon sx={{ fontSize: "1.25rem" }} />}
                  handleClick={() => handleTakePhoto()}
                >
                  See Overview
                </SolidBackgroundColorButton>
              </Box>
            </Box>
          </Stack>
        )}

        {/* Save Button - Only show after assignment */}
        {!showAssignmentForm && (
          <Box sx={{ mb: 10, mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSaveReport}
              disabled={saving}
              sx={{
                py: 1.5,
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              {saving ? "Creating Report..." : "Create Report"}
            </Button>
          </Box>
        )}
      </Container>
      <BottomNavBar />
    </>
  );
};

export default CreateReport;
