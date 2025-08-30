import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import { Card, Stack, Box, Typography, Container, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const AllProctors = () => {
  const jobId = 1;
  const handleNewProctor = () => {
    console.log("hello");
  };

  return (
    <>
      <HeaderWithBackButton title={`Job #${jobId}`} />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Proctors</Typography>
          <Button
            variant="contained"
            disableElevation
            sx={{
              borderRadius: 10,
            }}
            onClick={handleNewProctor}
          >
            <AddIcon />
          </Button>
        </Box>{" "}
        <Stack spacing={1}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "10px",
              boxShadow: "1px",
              border: "1px lightgrey solid",
            }}
          >
            <Stack
              direction="row"
              sx={{ display: "flex", alignItems: "center" }}
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
                src={"https://placehold.co/100"}
              />
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  Proctor #1 Riversand
                </Typography>
                <Typography variant="body2">Density: 1800 kg/m3</Typography>
                <Typography variant="body2">
                  Corrected Density: 1800 kg/m3
                </Typography>
                <Typography variant="body2">Optimum Moisture: 18%</Typography>
              </Box>
            </Stack>
          </Card>
          <Card
            elevation={0}
            sx={{
              borderRadius: "10px",
              boxShadow: "1px",
              border: "1px lightgrey solid",
            }}
          >
            <Stack
              direction="row"
              sx={{ display: "flex", alignItems: "center" }}
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
                src={"https://placehold.co/100"}
              />
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  Proctor #1 Riversand
                </Typography>
                <Typography variant="body2">Density: 1800 kg/m3</Typography>
                <Typography variant="body2">
                  Corrected Density: 1800 kg/m3
                </Typography>
                <Typography variant="body2">Optimum Moisture: 18%</Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};
export default AllProctors;
