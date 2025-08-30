import HeaderTitle from "@/components/headers/HeaderTitle";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import { Paper, Box, Typography, Stack, Container } from "@mui/material";
import { useParams } from "react-router-dom";

const AllDensityShots = () => {
  const { jobId, reportId } = useParams<{ jobId: string; reportId: string }>();
  const densityTests = [
    {
      id: 1,
      name: "Desnity Shot 1",
      location: "Grid AB-07",
      elevation: " 1.2m below final",
      material: "Riversand",
      density: "1789",
      compactionSpecification: "96% SPMDD",
      pass: 1,
    },
    {
      id: 2,
      name: "Density Shot 2",
      location: "Grid AB-07",
      elevation: " 1.2m below final",
      material: "Riversand",
      density: "1789",
      compactionSpecification: "96% SPMDD",
      pass: 0,
    },
    {
      id: 3,
      name: "Density Shot 3",
      location: "Grid AB-07",
      elevation: " 1.2m below final",
      material: "Riversand",
      density: "1789",
      compactionSpecification: "96% SPMDD",
      pass: 0,
    },
  ];

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId}`}
        subtitle={`Report ${reportId}`}
      />

      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <HeaderTitle title={"Density Tests"} />
        <Stack gap={2}>
          {densityTests.map((test) => (
            <Paper
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
              <Typography color={test.pass ? "success.main" : "error.main"}>
                {test.pass ? "PASS" : "FAIL"}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Container>
    </>
  );
};
export default AllDensityShots;
