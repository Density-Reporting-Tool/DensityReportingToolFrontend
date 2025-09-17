import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  TextField,
  Button,
  InputAdornment,
  Select,
  MenuItem,
  Modal,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type SitePlan = {
  id: number;
  name: string;
  src: string;
  dateCreated: string;
};

type Proctor = {
  id: number;
  testNo: number;
  name: string;
  type: "Modified" | "Standard";
  density: number;
  correctedDensity: number;
  optimumMoisture: number;
  oversizePercentage: number;
  src: "https://placehold.co/100";
};

type FormFields = {
  proctor: Proctor;
  location: string;
  elevation: string;
  testArea: string;
  oversizePercentage: number;
  probeDepth: number;
  probeDepthUnit: "m" | "cm" | "mm";
  compactionSpecification: number;
  compactionSpecificationUnit: "MPDD" | "SPDD";
  density: number;
  moistureContent: number;
  compactionPercentage: number;
  sitePlan: SitePlan;
};

// Mock data
const jobId = 1;
const reportId = 2;
const mockSitePlans: SitePlan[] = [
  {
    id: 1,
    name: "Site plan 1",
    src: "https://placehold.co/125",
    dateCreated: "Today",
  },
  {
    id: 2,
    name: "Site plan 2",
    src: "https://placehold.co/125",
    dateCreated: "Yesterday",
  },
  {
    id: 3,
    name: "Site plan 3",

    src: "https://placehold.co/125",
    dateCreated: "Two weeks ago",
  },
];
const mockProctors: Proctor[] = [
  {
    id: 1,
    testNo: 101,
    name: "John Doe",
    type: "Standard",
    density: 1.85,
    correctedDensity: 1.88,
    optimumMoisture: 12.5,
    oversizePercentage: 5.2,
    src: "https://placehold.co/100",
  },
  {
    id: 2,
    testNo: 102,
    name: "Jane Smith",
    type: "Modified",
    density: 1.92,
    correctedDensity: 1.95,
    optimumMoisture: 11.8,
    oversizePercentage: 4.7,
    src: "https://placehold.co/100",
  },
  {
    id: 3,
    testNo: 103,
    name: "Mike Johnson",
    type: "Standard",
    density: 1.78,
    correctedDensity: 1.8,
    optimumMoisture: 13.2,
    oversizePercentage: 6.1,
    src: "https://placehold.co/100",
  },
];

const DensityShotDetails = () => {
  const form = useForm<FormFields>({
    defaultValues: {
      proctor: mockProctors[0],
      location: "Garage Bay",
      elevation: "1.5m below final grade",
      testArea: "",
      oversizePercentage: 15,
      probeDepth: undefined,
      probeDepthUnit: "cm",
      compactionSpecification: undefined,
      compactionSpecificationUnit: "MPDD",
      density: undefined,
      moistureContent: undefined,
      compactionPercentage: undefined,
      sitePlan: mockSitePlans[0],
    },
  });

  const { register, handleSubmit, control, watch, setValue } = form;

  const [openSitePlanModal, setOpenSitePlanModal] = useState(false);
  const [openProctorModal, setOpenProctorModal] = useState(false);

  const [probeDepthUnit, compactionSpecificationUnit, selectedProctor] = watch([
    "probeDepthUnit",
    "compactionSpecificationUnit",
    "proctor",
  ]);

  const handleNewSitePlan = () => {
    console.log("New site plan");
  };

  const handleSelectSitePlan = (sitePlan: SitePlan) => {
    setOpenSitePlanModal(false);
    setValue("sitePlan", sitePlan, { shouldValidate: true });
    console.log("Site plan selected:", sitePlan);
  };

  const handleSelectProctor = (proctor: Proctor) => {
    setOpenProctorModal(false);
    setValue("proctor", proctor, { shouldValidate: true });
    console.log("proctor selected", proctor);
  };

  const onSubmit = (data: FormFields) => {
    console.log(data);
  };

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId}`}
        subtitle={`Report ${reportId}`}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Density Info */}
          <Stack id="density-info" sx={{ mb: 2 }} gap={2}>
            <Typography variant="h5">Shot #102</Typography>

            <Card
              elevation={0}
              sx={{
                borderRadius: "10px",
                boxShadow: "1px",
                border: "1px lightgrey solid",
              }}
              onClick={() => setOpenProctorModal(true)}
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
                    {selectedProctor.name}
                  </Typography>
                  <Typography variant="body2">
                    Density: {selectedProctor.density}
                  </Typography>
                  <Typography variant="body2">
                    Corrected Density: {selectedProctor.correctedDensity} kg/m3
                  </Typography>
                  <Typography variant="body2">
                    Optimum Moisture: {selectedProctor.optimumMoisture}{" "}
                  </Typography>
                </Box>
              </Stack>
            </Card>

            <Stack gap={1} sx={{ mb: 2 }}>
              <Stack gap={1} sx={{ mb: 4 }}>
                <TextField {...register("location")} label="Location" />
                <TextField {...register("elevation")} label="Elevation" />
                <TextField {...register("testArea")} label="Test Area" />

                <TextField
                  {...register("compactionSpecification")}
                  label="Compaction Specification"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography>%</Typography>
                          <Select
                            {...register("compactionSpecificationUnit")}
                            value={compactionSpecificationUnit}
                            disableUnderline // Optional: To remove underline from Select
                            variant="standard" // Optional: To match TextField's variant if needed
                          >
                            <MenuItem value="MPDD">MPDD</MenuItem>
                            <MenuItem value="SPDD">SPDD</MenuItem>
                          </Select>
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <TextField
                label="Oversize Percentage"
                {...register("oversizePercentage")}
                fullWidth={false}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
              <TextField
                {...register("probeDepth")}
                label="Probe Depth"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        {...register("probeDepthUnit")}
                        value={probeDepthUnit}
                        disableUnderline
                        variant="standard"
                      >
                        <MenuItem value="m">m</MenuItem>
                        <MenuItem value="cm">cm</MenuItem>
                        <MenuItem value="mm">mm</MenuItem>
                      </Select>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack gap={1} direction="row">
                <TextField
                  label="Density"
                  fullWidth={false}
                  {...register("density")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg/m³</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Moisture Content"
                  fullWidth={false}
                  {...register("moistureContent")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <TextField
                label="Compaction Percentage"
                fullWidth={false}
                {...register("compactionPercentage")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Stack>

          {/* Site plans */}
          <Stack id="density-shot-placement" sx={{ mb: 2 }} gap={2}>
            <Typography variant="h5"> Density Shot Location</Typography>
            <Stack gap={1}>
              <Controller
                name="sitePlan"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value.name}
                    label="Site Plan"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography
                            variant="body2"
                            onClick={() => setOpenSitePlanModal(true)}
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                              color: "primary",
                            }}
                          >
                            Change
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Stack>

            {/* Site plan image */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "500px",
                  borderRadius: 2,
                }}
                alt="Report photos"
                src={"https://placehold.co/500"}
              />
            </Box>
          </Stack>

          {/* Buttons */}
          <Stack
            sx={{
              justifyContent: "center",
            }}
            gap={1}
          >
            <Button type="submit" variant="contained">
              Save and add test
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <Button type="submit" variant="contained">
                Save and exit
              </Button>
              <Button variant="outlined">Cancel</Button>
            </Box>
          </Stack>
        </form>
      </Container>
      <Modal
        open={openSitePlanModal}
        onClose={() => setOpenSitePlanModal(false)}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          {/* Modal content */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: "80vh",
              maxWidth: "400px",
              backgroundColor: "white",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <IconButton
              onClick={() => {
                setOpenSitePlanModal(false);
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "black",
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                borderRadius: 2,
                maxHeight: "80vh",
                overflowY: "auto",
                p: 2,
                pt: 5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  m: 2,
                }}
              >
                <Typography variant="h6">Site Plans</Typography>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    borderRadius: 10,
                  }}
                  onClick={handleNewSitePlan}
                >
                  <AddIcon />
                </Button>
              </Box>
              <Stack spacing={3}>
                {mockSitePlans.map((sitePlan) => (
                  <Box
                    onClick={() => handleSelectSitePlan(sitePlan)}
                    key={sitePlan.id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      component="img"
                      sx={{
                        borderRadius: 2,
                        width: "80%",
                        mb: 1,
                      }}
                      alt="Report photos"
                      src={sitePlan.src}
                    />
                    <Box
                      sx={{
                        width: "80%",
                      }}
                    >
                      <Typography
                        variant="body1"
                        noWrap
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        Fig {sitePlan.id}: {sitePlan.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {sitePlan.dateCreated}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openProctorModal}
        onClose={() => {
          setOpenProctorModal(false);
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          {/* Modal content */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: "80vh",
              maxWidth: "400px",
              backgroundColor: "white",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <IconButton
              onClick={() => setOpenProctorModal(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "black",
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                borderRadius: 2,
                maxHeight: "80vh",
                overflowY: "auto",
                p: 2,
                pt: 5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Proctors</Typography>
              </Box>{" "}
              <Stack spacing={1}>
                {mockProctors.map((proctor) => {
                  return (
                    <Card
                      elevation={0}
                      key={proctor.id}
                      sx={{
                        borderRadius: "10px",
                        boxShadow: "1px",
                        border: "1px lightgrey solid",
                      }}
                      onClick={() => handleSelectProctor(proctor)}
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
                          src={proctor.src}
                        />
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {proctor.name}
                          </Typography>
                          <Typography variant="body2">
                            {proctor.density}
                          </Typography>
                          <Typography variant="body2">
                            {proctor.correctedDensity}
                          </Typography>
                          <Typography variant="body2">
                            {proctor.optimumMoisture}
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default DensityShotDetails;
