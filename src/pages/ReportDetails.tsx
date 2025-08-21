import SolidBackgroundColorButton from "@/components/button/SolidBackgroundColorButton";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import {
  Box,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  CameraAlt as CameraAltIcon,
} from "@mui/icons-material";
import HeaderTitleWithShowAll from "@/components/headers/HeaderTitleWithShowAll";

const report = {
  id: 4,
  jobId: 1,
  initials: "IC",
  densityTests: [
    {
      id: 1,
      name: "Desnity Shot 1",
      location: "Grid AB-07",
      elevation: " 1.2m below final",
      material: "Riversand",
      compactionSpecification: "96% SPMDD",
      pass: 1,
    },
    {
      id: 2,
      name: "Density Shot 2",
      location: "Grid AB-07",
      elevation: " 1.2m below final",
      material: "Riversand",
      compactionSpecification: "96% SPMDD",
      pass: 0,
    },
  ],
  reportPhotos: [
    {
      id: 1,
      src: "https://placehold.co/400",
      title: "Gridlines AA-01",
      elevation: "0.5m Above subgrade",
    },
    {
      id: 2,
      src: "https://placehold.co/400",
      title: "Gridlines AA-02",
      elevation: "0.7m Above subgrade",
    },
  ],
  description:
    "Description duis aute irure dolor in reprehenderit in voluptate",
  date: "Today",
};

const Report: React.FC = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const handleNewDensityShot = () => {
    navigate(`/report/${reportId}/densityShot/new`);
  };

  const handleTakePhoto = () => {
    console.log("Take photo");
  };

  const handleUploadImage = () => {
    console.log("Upload image");
  };
  return (
    <>
      <HeaderWithBackButton
        title={`Job #${report.jobId}`}
        subtitle={`Report ${report.id}`}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        {/* Density Test Section */}
        <Stack gap={3}>
          <Box id="densityTestSection">
            <HeaderTitleWithShowAll title="Density Tests" />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: 2,
              }}
            >
              {report.densityTests.length > 0 ? (
                report.densityTests.map((test) => (
                  <Card
                    key={test.id}
                    sx={{
                      padding: 2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="700">
                        Density shot {test.id}
                      </Typography>
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
                        Compaction Specification {test.compactionSpecification}
                      </Typography>
                    </Box>
                    <Typography
                      color={test.pass ? "success.main" : "error.main"}
                    >
                      {test.pass ? "PASS" : "FAIL"}
                    </Typography>
                  </Card>
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
                handleClick={(reportId?: string) =>
                  handleNewDensityShot(reportId)
                }
              >
                Add Density Test
              </SolidBackgroundColorButton>
            </Box>
          </Box>
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
          <Box id="reportPhotos">
            <HeaderTitleWithShowAll title="Report Photos" />
            {report.reportPhotos.length > 0 ? (
              <Stack gap={2}>
                {report.reportPhotos.map((photo) => (
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
              <Card sx={{ padding: 2, borderRadius: 2 }}>No density tests</Card>
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
    </>
  );
};
export default Report;
