import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import OutlineButton from "@/components/button/OutlineButton";
import SolidBackgroundColorButton from "@/components/button/SolidBackgroundColorButton";
import {
  Box,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  FormControl,
  Card,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import React from "react";
import WhiteTextField from "@/components/textfield/WhiteTextField";
const AddDensityTest = () => {
  const jobId = 1;
  const reportId = 2;

  const [sitePlan, setSitePlan] = React.useState("1");

  const handleSitePlanChange = (event: SelectChangeEvent) => {
    console.log("Site plan changed");
    setSitePlan(event.target.value);
  };

  const handleSaveAndAdd = () => {
    console.log("save and add");
  };

  const handleSaveAndExit = () => {
    console.log("save and exit");
  };

  const handleCancel = () => {
    console.log("Cancel");
  };

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId}`}
        subtitle={`Report ${reportId}`}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        {/* Density Info */}
        <Stack id="density-info" sx={{ mb: 2 }} gap={1}>
          <Typography variant="h5">Shot #102</Typography>
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
          <Stack gap={1} sx={{ mb: 2 }}>
            <WhiteTextField label="Location" value="Garage Bay" />
            <WhiteTextField label="Elevation" value="1.5m below final grade" />
            <Stack gap={1} direction="row">
              <WhiteTextField
                label="Density"
                fullWidth={false}
                value="1789"
                units={"kg/m3"}
              ></WhiteTextField>
              <WhiteTextField
                label="Moisture Content"
                fullWidth={false}
                value="50"
                units={"%"}
              ></WhiteTextField>
            </Stack>
          </Stack>
        </Stack>

        {/* Density Shot Placement */}
        <Box id="density-shot-placement" sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Density Shot Location
          </Typography>
          <Stack gap={2}>
            <FormControl fullWidth size="small">
              <Select
                value={sitePlan}
                onChange={handleSitePlanChange}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                }}
              >
                <MenuItem value={"1"}>Site plan 1</MenuItem>
                <MenuItem value={"2"}>Site plan 2</MenuItem>
              </Select>
            </FormControl>
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "auto",
                maxWidth: "500px",
                borderRadius: 2,
                mr: 2,
              }}
              alt="Report photos"
              src={"https://placehold.co/500"}
            />
          </Stack>
        </Box>

        {/* Buttons */}
        <Stack
          sx={{
            justifyContent: "center",
          }}
          gap={1}
        >
          <SolidBackgroundColorButton
            icon={<AddIcon sx={{ fontSize: "1.25rem" }} />}
            handleClick={handleSaveAndAdd}
          >
            Save and add test
          </SolidBackgroundColorButton>
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <SolidBackgroundColorButton handleClick={handleSaveAndExit}>
              Save and exit
            </SolidBackgroundColorButton>
            <OutlineButton handleClick={handleCancel}>Cancel</OutlineButton>
          </Box>
        </Stack>
      </Container>
    </>
  );
};
export default AddDensityTest;
