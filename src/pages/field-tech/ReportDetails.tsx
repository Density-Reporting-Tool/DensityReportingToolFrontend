import SolidBackgroundColorButton from "@/components/button/SolidBackgroundColorButton";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  CameraAlt as CameraAltIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import HeaderTitle from "@/components/headers/HeaderTitle";
import BottomNavBar from "@/components/navbar/BottomNavBar";
import { apiService } from "../../services/apiService";

// Types for report data
interface ReportData {
  id: number;
  jobId: number;
  reportNumber: string;
  startDate: string | null;
  submitDate: string | null;
  distributeDate: string | null;
  employee: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  reviewer: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  densityTests: Array<{
    id: number;
    testArea: string | null;
    location: string | null;
    elevationReference: string | null;
    elevationValue: number | null;
    elevationUnit: string | null;
    compactionSpecification: number | null;
    compactionSpecificationUnit: string | null;
    densityValue: number | null;
    moistureValue: number | null;
    createdDate: string | null;
  }>;
  photos: Array<{
    id: number;
    code: string | null;
    url: string | null;
    description: string | null;
    latitude: number | null;
    longitude: number | null;
    gpsAccuracyMeters: number | null;
  }>;
  memos: Array<{
    id: number;
    purpose: string | null;
    commentsAndObservations: string | null;
    conclusion: string | null;
    createdDate: string | null;
    updatedDate: string | null;
  }>;
}

const Report: React.FC = () => {
  const { jobId, reportId } = useParams<{ jobId: string; reportId: string }>();
  const navigate = useNavigate();

  // State for report data
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = useCallback(async () => {
    if (!reportId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getReport(parseInt(reportId));
      setReportData(response.data);
    } catch (err: any) {
      console.error("Error fetching report data:", err);
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  // Fetch report data on component mount
  useEffect(() => {
    if (reportId) {
      fetchReportData();
    }
  }, [reportId, fetchReportData]);

  const handleNewDensityShot = () => {
    console.log("ReportDetails - Navigating with reportId:", reportId);
    console.log("ReportDetails - JobId:", jobId);
    navigate(`/job/${jobId}/report/${reportId}/add-density-test`);
  };

  const handleTakePhoto = () => {
    console.log("Take photo");
  };

  const handleUploadImage = () => {
    console.log("Upload image");
  };

  const handleShowAllDensity = () => {
    console.log("show all density shot");
    navigate(`/job/${jobId}/report/${reportId}/all-density-shots`);
  };

  const handleShowAllPhotos = () => {
    navigate(`/job/${jobId}/report/${reportId}/all-photos`);
  };

  // Helper function to format elevation
  const formatElevation = (test: any) => {
    if (!test.elevationValue && !test.elevationReference)
      return "Not specified";
    const value = test.elevationValue
      ? `${test.elevationValue}${test.elevationUnit || ""}`
      : "";
    const reference = test.elevationReference
      ? ` ${test.elevationReference}`
      : "";
    return `${value}${reference}`.trim() || "Not specified";
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
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

  // No data state
  if (!reportData) {
    return (
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Report not found
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
        title={`Job #${jobId}`}
        subtitle={`Report #${reportData.reportNumber}`}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        {/* Density Test Section */}
        <Stack gap={1}>
          <Box id="densityTestSection">
            <HeaderTitle
              title="Density Tests"
              showAll={true}
              onClick={handleShowAllDensity}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: 2,
              }}
            >
              {reportData.densityTests.length > 0 ? (
                reportData.densityTests.map((test) => (
                  <Accordion key={test.id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`density-test-${test.id}-content`}
                      id={`density-test-${test.id}-header`}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          mr: 2,
                        }}
                      >
                        <Typography variant="body1" fontWeight="700">
                          Density Test {test.id}
                        </Typography>
                        <Typography
                          color={
                            test.densityValue && test.compactionSpecification
                              ? test.densityValue >=
                                test.compactionSpecification
                                ? "success.main"
                                : "error.main"
                              : "text.secondary"
                          }
                        >
                          {test.densityValue && test.compactionSpecification
                            ? test.densityValue >= test.compactionSpecification
                              ? "PASS"
                              : "FAIL"
                            : "PENDING"}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Location:</strong>{" "}
                          {test.location || "Not specified"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Elevation:</strong> {formatElevation(test)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Test Area:</strong>{" "}
                          {test.testArea || "Not specified"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Compaction Spec:</strong>{" "}
                          {test.compactionSpecification
                            ? `${test.compactionSpecification}% ${test.compactionSpecificationUnit || ""}`
                            : "Not specified"}
                        </Typography>
                        {test.densityValue && (
                          <Typography variant="body2">
                            <strong>Density:</strong> {test.densityValue}
                          </Typography>
                        )}
                        {test.moistureValue && (
                          <Typography variant="body2">
                            <strong>Moisture:</strong> {test.moistureValue}%
                          </Typography>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Card sx={{ padding: 2, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No density tests added yet
                  </Typography>
                </Card>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <SolidBackgroundColorButton
                icon={<AddIcon sx={{ fontSize: "1.25rem" }} />}
                handleClick={handleNewDensityShot}
              >
                Add Density Test
              </SolidBackgroundColorButton>
            </Box>
          </Box>
          <Box id="reportMemoSection" sx={{ my: 2 }}>
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
                  value={reportData.memos[0]?.purpose || ""}
                  sx={{ backgroundColor: "white" }}
                  minRows={2}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <TextField
                  id="report-comment-observations"
                  label="Comments / observations"
                  multiline
                  value={reportData.memos[0]?.commentsAndObservations || ""}
                  sx={{ backgroundColor: "white" }}
                  minRows={5}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <TextField
                  id="report-conclusion"
                  label="Conclusion"
                  multiline
                  value={reportData.memos[0]?.conclusion || ""}
                  sx={{ backgroundColor: "white" }}
                  minRows={2}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Stack>
          </Box>
          <Box id="reportPhotos">
            <HeaderTitle title="Report Photos" onClick={handleShowAllPhotos} />
            {reportData.photos.length > 0 ? (
              <Stack gap={2}>
                {reportData.photos.map((photo) => (
                  <Card
                    key={photo.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      boxShadow: "none",
                    }}
                  >
                    <Box
                      component="img"
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "100px",
                        borderRadius: 2,
                        mr: 2,
                      }}
                      alt="Report photos"
                      src={
                        photo.url ||
                        "https://placehold.co/100x100?text=No+Image"
                      }
                    />
                    <Box>
                      <Typography variant="h6">Figure {photo.id}</Typography>
                      <Typography variant="body2">
                        {photo.description || "No description"}
                      </Typography>
                      <Typography variant="body2">
                        {photo.code || "No code"}
                      </Typography>
                      {photo.latitude && photo.longitude && (
                        <Typography variant="caption" color="text.secondary">
                          GPS: {photo.latitude.toFixed(4)},{" "}
                          {photo.longitude.toFixed(4)}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Card sx={{ padding: 2, borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No photos added yet
                </Typography>
              </Card>
            )}
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
                  handleClick={() => handleUploadImage}
                >
                  Upload Image
                </SolidBackgroundColorButton>
                <SolidBackgroundColorButton
                  icon={<CameraAltIcon sx={{ fontSize: "1.25rem" }} />}
                  handleClick={() => handleTakePhoto}
                >
                  Take Photo
                </SolidBackgroundColorButton>
              </Box>
              <SolidBackgroundColorButton
                icon={<CameraAltIcon sx={{ fontSize: "1.25rem" }} />}
                handleClick={() => handleTakePhoto}
              >
                See Overview
              </SolidBackgroundColorButton>
            </Box>
          </Box>
        </Stack>
      </Container>
      <BottomNavBar />
    </>
  );
};

export default Report;
