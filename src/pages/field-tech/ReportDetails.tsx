import SolidBackgroundColorButton from "@/components/button/SolidBackgroundColorButton";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
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
import { useEffect } from "react";
import {
  Add as AddIcon,
  CameraAlt as CameraAltIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import HeaderTitle from "@/components/headers/HeaderTitle";
import BottomNavBar from "@/components/navbar/BottomNavBar";
import Webcam from "react-webcam";
import { useRef, useState } from "react";

import UploadWidget from "@/components/UploadWidget";
import EditIcon from "@mui/icons-material/Edit";
import { ReportReadDTO } from "@/types/dtos/report";
import { reportApiService } from "@/services/reportApi";

// const report = {
//   id: 4,
//   jobId: 1,
//   initials: "IC",
//   densityTests: [
//     {
//       id: 1,
//       name: "Density Shot 1",
//       location: "Grid AB-07",
//       elevation: " 1.2m below final",
//       material: "Riversand",
//       density: "1789",
//       compactionSpecification: "96% SPMDD",
//       pass: 1,
//     },
//     {
//       id: 2,
//       name: "Density Shot 2",
//       location: "Grid AB-07",
//       elevation: " 1.2m below final",
//       material: "Riversand",
//       density: "1789",
//       compactionSpecification: "96% SPMDD",
//       pass: 0,
//     },
//     {
//       id: 3,
//       name: "Density Shot 3",
//       location: "Grid AB-07",
//       elevation: " 1.2m below final",
//       material: "Riversand",
//       density: "1789",
//       compactionSpecification: "96% SPMDD",
//       pass: 1,
//     },
//   ],
//   reportPhotos: [
//     {
//       id: 1,
//       src: "https://placehold.co/400",
//       title: "Gridlines AA-01",
//       elevation: "0.5m Above subgrade",
//     },
//     {
//       id: 2,
//       src: "https://placehold.co/400",
//       title: "Gridlines AA-02",
//       elevation: "0.7m Above subgrade",
//     },
//   ],
//   description:
//     "Description duis aute irure dolor in reprehenderit in voluptate",
//   date: "Today",
// };

const Report: React.FC = () => {
  const { jobNumber, reportId } = useParams<{
    jobNumber: string;
    reportId: string;
  }>();
  const navigate = useNavigate();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [reportData, setReportData] = useState<ReportReadDTO | null>(null);
  // const [reportPhotos, setReportPhotos] = useState(reportData?.photos);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await reportApiService.getReportById(reportId);
        setReportData(response);
        console.log("Report data: ", response?.data);
      } catch (err) {
        console.error("Error occured while fetching report data", err);
      }
    };
    fetchReportData();
  }, [reportId]);
  const webcamRef = useRef<Webcam>(null);

  const handleClickEdit = () => {
    navigate(`/field-tech/add-density-test`);
  };
  const handleTakePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedPhoto(imageSrc);
      }
    }
  };

  // const handleKeepPhoto = async () => {
  //   if (capturedPhoto) {
  //     try {
  //       const uploadedUrl = await uploadImageToCloudinary(capturedPhoto);

  //       if (uploadedUrl) {
  //         const newPhoto = {
  //           id: reportPhotos.length + 1,
  //           src: uploadedUrl,
  //           title: `Photo ${reportPhotos.length + 1}`,
  //           elevation: "New photo",
  //         };
  //         setReportPhotos([...reportPhotos, newPhoto]);
  //       } else {
  //         const newPhoto = {
  //           id: reportPhotos.length + 1,
  //           src: capturedPhoto,
  //           title: `Photo ${reportPhotos.length + 1}`,
  //           elevation: "New photo",
  //         };
  //         setReportPhotos([...reportPhotos, newPhoto]);
  //       }
  //     } catch (error) {
  //       console.error("Error handling photo:", error);
  //       const newPhoto = {
  //         id: reportPhotos.length + 1,
  //         src: capturedPhoto,
  //         title: `Photo ${reportPhotos.length + 1}`,
  //         elevation: "New photo",
  //       };
  //       setReportPhotos([...reportPhotos, newPhoto]);
  //     }
  //   }

  //   setShowPhotoModal(false);
  //   setCapturedPhoto(null);
  // };

  const handleSaveReport = () => {
    console.log("Save Report");
  };

  // const uploadImageToCloudinary = async (base64Photo: string) => {
  //   const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  //   const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  //   if (!cloudName || !uploadPreset) {
  //     console.error(
  //       "Cloudinary credentials not found in environment variables",
  //     );
  //     return null;
  //   }

  //   const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  //   try {
  //     const response = await fetch(base64Photo);
  //     const blob = await response.blob();

  //     const formData = new FormData();
  //     formData.append("file", blob);
  //     formData.append("upload_preset", uploadPreset);

  //     const uploadResponse = await fetch(url, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!uploadResponse.ok) {
  //       throw new Error(`Upload failed: ${uploadResponse.statusText}`);
  //     }

  //     const data = await uploadResponse.json();
  //     console.log("Cloudinary uploaded URL:", data.secure_url);
  //     return data.secure_url;
  //   } catch (error) {
  //     console.error("Upload to Cloudinary failed:", error);
  //     return null;
  //   }
  // };

  const handleCloseModal = () => {
    setShowPhotoModal(false);
    setCapturedPhoto(null);
  };

  const handleAddDensityShot = () => {
    navigate(`/field-tech/add-density-test`);
  };

  const handleShowAllDensity = () => {
    navigate(`/job/${jobNumber}/report/${reportId}/all-density-shots`);
  };

  const handleShowAllPhotos = () => {
    navigate(`/job/${jobNumber}/report/${reportId}/all-photos`);
  };

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobNumber}`}
        subtitle={`Report ${reportId}`}
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
              {reportData?.densityTests?.length > 0 ? (
                reportData?.densityTests?.map((test) => (
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
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{
                        minHeight: 40,
                        "&.Mui-expanded": {
                          minHeight: 40,
                        },
                        "& .MuiAccordionSummary-content": {
                          margin: 0,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography component="span">{test.name}</Typography>
                        <Typography
                          color={test.pass ? "success.main" : "error.main"}
                        >
                          {test.pass ? "PASS" : "FAIL"}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box>
                        <Typography variant="body2">
                          Location: {test.location}
                        </Typography>
                        <Typography variant="body2">
                          Elevation: {test.elevation}
                        </Typography>
                        <Typography variant="body2">
                          Material: {test.material}
                        </Typography>
                        <Typography variant="body2">
                          Density: {test.density}
                        </Typography>
                        <Typography variant="body2">
                          Compaction Specification:
                          {test.compactionSpecification}
                        </Typography>
                      </Box>
                      <IconButton sx={{ height: "100px" }}>
                        <EditIcon onClick={handleClickEdit}></EditIcon>
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
                />
              </Box>
              <Box>
                {/* <Typography variant="h6">Comment/Observations</Typography> */}
                <TextField
                  id="report-comment-observations"
                  label="Comments / observations"
                  multiline
                  sx={{ backgroundColor: "white" }}
                  minRows={5}
                  fullWidth
                />
              </Box>
              <Box>
                {/* <Typography variant="h6">Conclusion</Typography> */}
                <TextField
                  id="report-conclusion"
                  label="Conclusion"
                  multiline
                  sx={{ backgroundColor: "white" }}
                  minRows={2}
                  fullWidth
                />
              </Box>
            </Stack>
          </Box>
          <Box id="reportPhotos" sx={{ my: 2 }}>
            <HeaderTitle
              title="Report Photos"
              showAll={true}
              onClick={handleShowAllPhotos}
            />
            {reportData?.photos?.length > 0 ? (
              <Stack gap={2}>
                {reportData?.photos?.map((photo: any) => (
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
                      src={photo.src}
                    />
                    <Box>
                      <Typography variant="h6">Figure {photo.id}</Typography>
                      <Typography variant="body2">{photo.title}</Typography>
                      <Typography variant="body2">{photo.elevation}</Typography>
                    </Box>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Card sx={{ padding: 2, borderRadius: 2 }}>No photos </Card>
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
                handleClick={handleSaveReport}
              >
                Save
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
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  mb: 2,
                }}
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
                onClick={() => {
                  setCapturedPhoto(null);
                }}
                variant="outlined"
                color="secondary"
              >
                Retake Photo
              </Button>
              <Button
                // onClick={handleKeepPhoto}
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
