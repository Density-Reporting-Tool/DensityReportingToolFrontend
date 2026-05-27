import SolidBackgroundColorButton from "@/components/button/SolidBackgroundColorButton";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  Add as AddIcon,
  CameraAlt as CameraAltIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import HeaderTitle from "@/components/headers/HeaderTitle";
import BottomNavBar from "@/components/navbar/BottomNavBar";
import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";
import UploadWidget from "@/components/UploadWidget";
import EditIcon from "@mui/icons-material/Edit";
import { reportsApiService } from "@/services/reportsApiService";
import { DensityTestInfo, PhotoInfo, ReportDetailResponse } from "@/dtos/report";

const Report: React.FC = () => {
  const { jobId, reportId } = useParams<{ jobId: string; reportId: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<ReportDetailResponse | null>(null);
  const [photos, setPhotos] = useState<PhotoInfo[]>([]);
  const [purpose, setPurpose] = useState("");
  const [comments, setComments] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingMemo, setSavingMemo] = useState(false);
  const [memoSaved, setMemoSaved] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    if (!reportId) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await reportsApiService.getReport(Number(reportId));
        const data = res.data as unknown as ReportDetailResponse;
        setReport(data);
        setPhotos(data.photos ?? []);
        if (data.memos?.length > 0) {
          setPurpose(data.memos[0].purpose ?? "");
          setComments(data.memos[0].commentsAndObservations ?? "");
          setConclusion(data.memos[0].conclusion ?? "");
        }
      } catch (err) {
        console.error("Error loading report:", err);
        setError("Failed to load report.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reportId]);

  const handleClickEdit = (testId: number) => {
    const jobNumber = report?.job?.jobNumber ?? "";
    navigate(
      `/field-tech/add-density-test?reportId=${reportId}&jobId=${jobId}&jobNumber=${jobNumber}&testId=${testId}`,
    );
  };

  const handleSaveMemo = async () => {
    if (!reportId || savingMemo) return;
    try {
      setSavingMemo(true);
      setMemoSaved(false);
      await reportsApiService.updateMemo(Number(reportId), {
        purpose,
        commentsAndObservations: comments,
        conclusion,
      });
      setMemoSaved(true);
    } catch (err) {
      console.error("Failed to save memo:", err);
    } finally {
      setSavingMemo(false);
    }
  };

  const handleTakePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) setCapturedPhoto(imageSrc);
    }
  };

  const uploadImageToCloudinary = async (base64Photo: string): Promise<string | null> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) return null;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    try {
      const response = await fetch(base64Photo);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", uploadPreset);
      const uploadResponse = await fetch(url, { method: "POST", body: formData });
      if (!uploadResponse.ok) throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      const data = await uploadResponse.json();
      return data.secure_url as string;
    } catch {
      return null;
    }
  };

  const handleKeepPhoto = async () => {
    if (capturedPhoto) {
      const uploadedUrl = await uploadImageToCloudinary(capturedPhoto);
      const newPhoto: PhotoInfo = {
        id: photos.length + 1,
        url: uploadedUrl ?? capturedPhoto,
        description: `Photo ${photos.length + 1}`,
      };
      setPhotos([...photos, newPhoto]);
    }
    setShowPhotoModal(false);
    setCapturedPhoto(null);
  };

  const handleCloseModal = () => {
    setShowPhotoModal(false);
    setCapturedPhoto(null);
  };

  const handleAddDensityShot = () => {
    const jobNumber = report?.job?.jobNumber ?? "";
    navigate(
      `/field-tech/add-density-test?reportId=${reportId}&jobId=${jobId}&jobNumber=${jobNumber}`,
    );
  };

  const handleShowAllDensity = () => {
    navigate(`/job/${jobId}/report/${reportId}/all-density-shots`);
  };

  const handleShowAllPhotos = () => {
    navigate(`/job/${jobId}/report/${reportId}/all-photos`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !report) {
    return (
      <>
        <HeaderWithBackButton title={`Job #${jobId}`} subtitle={`Report ${reportId}`} />
        <Container maxWidth="xl" sx={{ my: 3 }}>
          <Typography color="error">{error ?? "Report not found."}</Typography>
        </Container>
      </>
    );
  }

  const densityTests: DensityTestInfo[] = report.densityTests ?? [];

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId}`}
        subtitle={`Report ${report.reportNumber}`}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
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
              {densityTests.length > 0 ? (
                densityTests.map((test: DensityTestInfo, index: number) => (
                  <Accordion
                    key={test.id}
                    disableGutters
                    square={true}
                    sx={{
                      borderRadius: "5px",
                      border: "1px solid lightgrey",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${test.id}-content`}
                      id={`panel${test.id}-header`}
                      sx={{
                        minHeight: 40,
                        "&.Mui-expanded": { minHeight: 40 },
                        "& .MuiAccordionSummary-content": { margin: 0 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography component="span">
                          {test.testArea ?? `Density Test #${test.testNumber || index + 1}`}
                        </Typography>
                        <Typography
                          color={test.passed ? "success.main" : "error.main"}
                        >
                          {test.passed ? "PASS" : "FAIL"}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box>
                        {test.location && (
                          <Typography variant="body2">
                            Location: {test.location}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          Elevation: {test.elevationValue}{" "}
                          {test.elevationUnit ?? ""}
                          {test.elevationReference
                            ? ` (${test.elevationReference})`
                            : ""}
                        </Typography>
                        <Typography variant="body2">
                          Compaction: {test.compactionPercentage.toFixed(1)}%
                          (spec: {test.compactionSpecification}
                          {test.compactionSpecificationUnit ?? "%"})
                        </Typography>
                        <Typography variant="body2">
                          Density: {test.densityValue}
                        </Typography>
                      </Box>
                      <IconButton
                        sx={{ height: "100px" }}
                        onClick={() => handleClickEdit(test.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Card sx={{ padding: 2, borderRadius: 2 }}>
                  No density tests
                </Card>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <SolidBackgroundColorButton
                icon={<AddIcon sx={{ fontSize: "1.25rem" }} />}
                handleClick={handleAddDensityShot}
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
                  sx={{ backgroundColor: "white" }}
                  minRows={2}
                  fullWidth
                  value={purpose}
                  onChange={(e) => { setPurpose(e.target.value); setMemoSaved(false); }}
                />
              </Box>
              <Box>
                <TextField
                  id="report-comment-observations"
                  label="Comments / observations"
                  multiline
                  sx={{ backgroundColor: "white" }}
                  minRows={5}
                  fullWidth
                  value={comments}
                  onChange={(e) => { setComments(e.target.value); setMemoSaved(false); }}
                />
              </Box>
              <Box>
                <TextField
                  id="report-conclusion"
                  label="Conclusion"
                  multiline
                  sx={{ backgroundColor: "white" }}
                  minRows={2}
                  fullWidth
                  value={conclusion}
                  onChange={(e) => {
                    setConclusion(e.target.value);
                    setMemoSaved(false);
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                {memoSaved && (
                  <Typography variant="body2" color="success.main" sx={{ alignSelf: "center" }}>
                    Saved
                  </Typography>
                )}
                <Button
                  variant="contained"
                  disabled={savingMemo}
                  onClick={handleSaveMemo}
                  sx={{ borderRadius: 2 }}
                >
                  {savingMemo ? "Saving…" : "Save Memo"}
                </Button>
              </Box>
            </Stack>
          </Box>

          <Box id="reportPhotos" sx={{ my: 2 }}>
            <HeaderTitle
              title="Report Photos"
              showAll={true}
              onClick={handleShowAllPhotos}
            />
            {photos.length > 0 ? (
              <Stack gap={2}>
                {photos.map((photo: PhotoInfo, index: number) => (
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
                    {photo.url && (
                      <Box
                        component="img"
                        sx={{
                          width: "100%",
                          height: "auto",
                          maxWidth: "100px",
                          borderRadius: 2,
                          mr: 2,
                        }}
                        alt="Report photo"
                        src={photo.url}
                      />
                    )}
                    <Box>
                      <Typography variant="h6">Figure {index + 1}</Typography>
                      {photo.code && (
                        <Typography variant="body2">{photo.code}</Typography>
                      )}
                      {photo.description && (
                        <Typography variant="body2">
                          {photo.description}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Card sx={{ padding: 2, borderRadius: 2 }}>No photos</Card>
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
                <UploadWidget />
                <SolidBackgroundColorButton
                  icon={<CameraAltIcon sx={{ fontSize: "1.25rem" }} />}
                  handleClick={() => setShowPhotoModal(true)}
                >
                  Take Photo
                </SolidBackgroundColorButton>
              </Box>
              <SolidBackgroundColorButton
                icon={<CameraAltIcon sx={{ fontSize: "1.25rem" }} />}
                handleClick={() => console.log("See Overview")}
              >
                See Overview
              </SolidBackgroundColorButton>
            </Box>
          </Box>
        </Stack>
      </Container>
      <BottomNavBar />

      <Dialog
        open={showPhotoModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {capturedPhoto ? "Review Photo" : "Take Photo"}
        </DialogTitle>
        <DialogContent>
          {capturedPhoto ? (
            <Box>
              <Box
                component="img"
                src={capturedPhoto}
                alt="Captured photo"
                sx={{ width: "100%", height: "auto", borderRadius: 2, mb: 2 }}
              />
            </Box>
          ) : (
            <Box>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                videoConstraints={{ facingMode: "environment" }}
                width="100%"
                style={{ borderRadius: 8 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          {capturedPhoto ? (
            <>
              <Button
                onClick={() => setCapturedPhoto(null)}
                variant="outlined"
                color="secondary"
              >
                Retake Photo
              </Button>
              <Button
                onClick={handleKeepPhoto}
                variant="contained"
                color="success"
              >
                Keep Photo
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
              <SolidBackgroundColorButton
                icon={<CameraAltIcon sx={{ fontSize: "1.25rem" }} />}
                handleClick={handleTakePhoto}
              >
                Take Photo
              </SolidBackgroundColorButton>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Report;
