import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import ProctorCard from "@/components/card/ProctorCard";
import EmptyCard from "@/components/card/EmptyCard";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Select,
  MenuItem,
  Modal,
  IconButton,
  Chip,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { proctorApiService } from "@/services/lab-admin/proctorApiService";
import { reportsApiService } from "@/services/reportsApiService";
import { ProctorData } from "@/types/proctors";
import { SitePlan } from "@/types/sitePlan";
import { useProctorStore } from "@/stores/proctorStore";

// Backend-accepted enum string values
type ElevationUnit = "Meters" | "Feet";
type ElevationReference =
  | "AboveSubgrade"
  | "BelowSubgrade"
  | "AboveFinalGrade"
  | "BelowFinalGrade"
  | "Geodetic"
  | "DesignElevation"
  | "ExistingGround"
  | "TopOfPavement"
  | "TopOfBaseCourse"
  | "TopOfSubbase"
  | "TopOfLift"
  | "BottomOfLift";
type ProbeDepthUnit = "Cm" | "Inch";
type CompactionSpecificationUnit = "SPDD" | "MPDD";

type FormFields = {
  proctor: ProctorData;
  location: string;
  testArea: string;
  elevationValue: number;
  elevationUnit: ElevationUnit;
  elevationReference: ElevationReference;
  oversizePercentage: number;
  probeDepth: number;
  probeDepthUnit: ProbeDepthUnit;
  compactionSpecification: number;
  compactionSpecificationUnit: CompactionSpecificationUnit;
  density: number;
  moistureContent: number;
  sitePlan: SitePlan;
};

// TODO[SITE-PLANS]: Replace with real site plans fetched from /api/jobs/{jobNumber}/site-plans
const mockSitePlans: SitePlan[] = [
  { id: 1, name: "Site plan 1", src: "https://placehold.co/125", dateCreated: "Today" },
  { id: 2, name: "Site plan 2", src: "https://placehold.co/125", dateCreated: "Yesterday" },
  { id: 3, name: "Site plan 3", src: "https://placehold.co/125", dateCreated: "Two weeks ago" },
];

const defaultValues: Partial<FormFields> = {
  location: "",
  testArea: "",
  elevationValue: undefined,
  elevationUnit: "Meters",
  elevationReference: "AboveSubgrade",
  oversizePercentage: 0,
  probeDepth: undefined,
  probeDepthUnit: "Cm",
  compactionSpecification: undefined,
  compactionSpecificationUnit: "SPDD",
  density: undefined,
  moistureContent: undefined,
  sitePlan: mockSitePlans[0],
};

const DensityShotDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read context from query params passed by ReportDetails
  const reportId = searchParams.get("reportId");
  const jobId = searchParams.get("jobId");
  const jobNumber = searchParams.get("jobNumber");

  const [proctors, setProctors] = useState<ProctorData[]>();
  const [openSitePlanModal, setOpenSitePlanModal] = useState(false);
  const [openProctorModal, setOpenProctorModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [calculatedCompaction, setCalculatedCompaction] = useState<number | null>(null);

  // Tracks which button triggered submit so onSubmit knows what to do after success
  const saveAction = useRef<"add" | "exit">("exit");

  const { selectedProctor, selectedProctorIndex, setSelectedProctor } = useProctorStore();

  const form = useForm<FormFields>({ defaultValues });
  const { register, handleSubmit, control, watch, setValue, reset } = form;

  const [watchedDensity, probeDepthUnit, compactionSpecificationUnit, elevationUnit, elevationReference] = watch([
    "density",
    "probeDepthUnit",
    "compactionSpecificationUnit",
    "elevationUnit",
    "elevationReference",
  ]);

  // Compute compaction percentage client-side whenever density or selected proctor changes
  useEffect(() => {
    const corrected = parseFloat(selectedProctor?.correctedDensity ?? "");
    const density = Number(watchedDensity);
    if (corrected > 0 && density > 0) {
      setCalculatedCompaction(Math.round((density / corrected) * 1000) / 10);
    } else {
      setCalculatedCompaction(null);
    }
  }, [watchedDensity, selectedProctor]);

  const handleClickProctorField = () => {
    setOpenProctorModal(true);
    handleGetAllProctors();
  };

  const handleNewSitePlan = () => {
    console.log("New site plan");
  };

  const handleSelectSitePlan = (sitePlan: SitePlan) => {
    setOpenSitePlanModal(false);
    setValue("sitePlan", sitePlan, { shouldValidate: true });
  };

  const handleSelectProctor = (proctor: ProctorData, index: number) => {
    setOpenProctorModal(false);
    setValue("proctor", proctor, { shouldValidate: true });
    setSelectedProctor(proctor, index);
  };

  const onSubmit = async (data: FormFields) => {
    if (!data.proctor?.id) {
      setSubmitError("Please select a proctor before saving.");
      return;
    }
    if (!reportId) {
      setSubmitError("No report ID — navigate here from a report.");
      return;
    }

    setSubmitError(null);

    try {
      await reportsApiService.createDensityTest(Number(reportId), {
        proctorId: data.proctor.id as number,
        testArea: data.testArea || undefined,
        location: data.location || undefined,
        elevationReference: data.elevationReference,
        elevationValue: Number(data.elevationValue),
        elevationUnit: data.elevationUnit,
        correctedOversizePercentage: Number(data.oversizePercentage),
        probeDepth: Number(data.probeDepth),
        probeDepthUnit: data.probeDepthUnit,
        compactionSpecification: Number(data.compactionSpecification),
        compactionSpecificationUnit: data.compactionSpecificationUnit,
        densityValue: Number(data.density),
        moistureValue: Number(data.moistureContent),
      });

      if (saveAction.current === "add") {
        // Keep location context, reset only measurements
        reset({
          ...defaultValues,
          proctor: data.proctor,
          location: data.location,
          testArea: data.testArea,
          elevationValue: data.elevationValue,
          elevationUnit: data.elevationUnit,
          elevationReference: data.elevationReference,
          compactionSpecification: data.compactionSpecification,
          compactionSpecificationUnit: data.compactionSpecificationUnit,
          sitePlan: data.sitePlan,
        });
        setCalculatedCompaction(null);
      } else {
        navigate(`/field-tech/job/${jobId}/report/${reportId}`);
      }
    } catch (err) {
      console.error("Error creating density test:", err);
      setSubmitError("Failed to save density test. Please try again.");
    }
  };

  const handleGetAllProctors = async () => {
    if (!jobNumber) {
      console.warn("No jobNumber in URL — cannot fetch proctors");
      return;
    }
    try {
      const response = await proctorApiService.getAllProctors(jobNumber);
      setProctors(response.data);
    } catch (error) {
      console.error("Error fetching proctors", error);
    }
  };

  return (
    <>
      <HeaderWithBackButton
        title={jobId ? `Job #${jobId}` : "New Density Test"}
        subtitle={reportId ? `Report ${reportId}` : undefined}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack id="density-info" sx={{ mb: 2 }} gap={2}>
            <Typography variant="h5">New Density Shot</Typography>

            {submitError && (
              <Typography color="error" variant="body2">
                {submitError}
              </Typography>
            )}

            {/* Proctor */}
            {selectedProctor ? (
              <ProctorCard
                index={selectedProctorIndex}
                proctor={selectedProctor}
                handleClick={handleClickProctorField}
              />
            ) : (
              <EmptyCard
                text={"Click to select proctor"}
                handleClick={handleClickProctorField}
              />
            )}

            <Stack gap={1} sx={{ mb: 2 }}>
              <Stack gap={1} sx={{ mb: 2 }}>
                <TextField {...register("location")} label="Location" />
                <TextField {...register("testArea")} label="Test Area" />

                {/* Elevation — split into value + unit + reference to match backend */}
                <Stack direction="row" gap={1}>
                  <TextField
                    {...register("elevationValue")}
                    label="Elevation"
                    type="number"
                    inputProps={{ step: "any" }}
                    sx={{ flex: 1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Select
                            {...register("elevationUnit")}
                            value={elevationUnit ?? "Meters"}
                            disableUnderline
                            variant="standard"
                          >
                            <MenuItem value="Meters">m</MenuItem>
                            <MenuItem value="Feet">ft</MenuItem>
                          </Select>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
                <Select
                  {...register("elevationReference")}
                  value={elevationReference ?? "AboveSubgrade"}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="AboveSubgrade">Above Subgrade</MenuItem>
                  <MenuItem value="BelowSubgrade">Below Subgrade</MenuItem>
                  <MenuItem value="AboveFinalGrade">Above Final Grade</MenuItem>
                  <MenuItem value="BelowFinalGrade">Below Final Grade</MenuItem>
                  <MenuItem value="Geodetic">Geodetic</MenuItem>
                  <MenuItem value="DesignElevation">Design Elevation</MenuItem>
                  <MenuItem value="ExistingGround">Existing Ground</MenuItem>
                  <MenuItem value="TopOfPavement">Top of Pavement</MenuItem>
                  <MenuItem value="TopOfBaseCourse">Top of Base Course</MenuItem>
                  <MenuItem value="TopOfSubbase">Top of Subbase</MenuItem>
                  <MenuItem value="TopOfLift">Top of Lift</MenuItem>
                  <MenuItem value="BottomOfLift">Bottom of Lift</MenuItem>
                </Select>

                <TextField
                  {...register("compactionSpecification")}
                  label="Compaction Specification"
                  type="number"
                  inputProps={{ step: "any" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography>%</Typography>
                          <Select
                            {...register("compactionSpecificationUnit")}
                            value={compactionSpecificationUnit}
                            disableUnderline
                            variant="standard"
                          >
                            <MenuItem value="SPDD">SPDD</MenuItem>
                            <MenuItem value="MPDD">MPDD</MenuItem>
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
                type="number"
                inputProps={{ step: "any" }}
                fullWidth={false}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />

              <TextField
                {...register("probeDepth")}
                label="Probe Depth"
                type="number"
                inputProps={{ step: "any" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        {...register("probeDepthUnit")}
                        value={probeDepthUnit}
                        disableUnderline
                        variant="standard"
                      >
                        <MenuItem value="Cm">cm</MenuItem>
                        <MenuItem value="Inch">in</MenuItem>
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
                  type="number"
                  inputProps={{ step: "any" }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg/m³</InputAdornment>,
                  }}
                />
                <TextField
                  label="Moisture Content"
                  fullWidth={false}
                  {...register("moistureContent")}
                  type="number"
                  inputProps={{ step: "any" }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Stack>

              {/* Compaction percentage — computed from density ÷ proctor corrected density */}
              {calculatedCompaction !== null && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Compaction:
                  </Typography>
                  <Chip
                    label={`${calculatedCompaction}%`}
                    color={
                      calculatedCompaction >= (watch("compactionSpecification") || 0)
                        ? "success"
                        : "error"
                    }
                    size="small"
                  />
                </Box>
              )}
            </Stack>
          </Stack>

          {/* Site plans */}
          <Stack id="density-shot-placement" sx={{ mb: 2 }} gap={2}>
            <Typography variant="h5">Density Shot Location</Typography>
            <Stack gap={1}>
              <Controller
                name="sitePlan"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value?.name ?? ""}
                    label="Site Plan"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography
                            variant="body2"
                            onClick={() => setOpenSitePlanModal(true)}
                            sx={{ cursor: "pointer", textDecoration: "underline" }}
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

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Box
                component="img"
                sx={{ width: "100%", height: "auto", maxWidth: "500px", borderRadius: 2 }}
                alt="Site plan"
                src={"https://placehold.co/500"}
              />
            </Box>
          </Stack>

          {/* Action Buttons */}
          <Stack sx={{ justifyContent: "center" }} gap={1}>
            <Button
              type="submit"
              variant="contained"
              onClick={() => { saveAction.current = "add"; }}
            >
              Save and add test
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <Button
                type="submit"
                variant="contained"
                onClick={() => { saveAction.current = "exit"; }}
              >
                Save and exit
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/field-tech/job/${jobId}/report/${reportId}`)}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        </form>
      </Container>

      {/* Site Plan Modal */}
      <Modal open={openSitePlanModal} onClose={() => setOpenSitePlanModal(false)}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: "80vh",
              maxWidth: 400,
              backgroundColor: "white",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <IconButton
              onClick={() => setOpenSitePlanModal(false)}
              sx={{ position: "absolute", top: 8, right: 8, color: "black" }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ borderRadius: 2, maxHeight: "80vh", overflowY: "auto", p: 2, pt: 5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", m: 2 }}>
                <Typography variant="h6">Site Plans</Typography>
                <Button variant="contained" disableElevation sx={{ borderRadius: 10 }} onClick={handleNewSitePlan}>
                  <AddIcon />
                </Button>
              </Box>
              <Stack spacing={3}>
                {mockSitePlans.map((sitePlan) => (
                  <Box
                    key={sitePlan.id}
                    onClick={() => handleSelectSitePlan(sitePlan)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      component="img"
                      sx={{ borderRadius: 2, width: "80%", mb: 1 }}
                      alt="Site plan thumbnail"
                      src={sitePlan.src}
                    />
                    <Box sx={{ width: "80%" }}>
                      <Typography variant="body1" noWrap>
                        Fig {sitePlan.id}: {sitePlan.name}
                      </Typography>
                      <Typography variant="caption" noWrap>
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

      {/* Proctor Modal */}
      <Modal open={openProctorModal} onClose={() => setOpenProctorModal(false)}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: "80vh",
              maxWidth: 400,
              backgroundColor: "white",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <IconButton
              onClick={() => setOpenProctorModal(false)}
              sx={{ position: "absolute", top: 8, right: 8, color: "black" }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ borderRadius: 2, maxHeight: "80vh", overflowY: "auto", p: 2, pt: 5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Proctors</Typography>
                {!jobNumber && (
                  <Typography variant="caption" color="error">
                    No job number — cannot load proctors
                  </Typography>
                )}
              </Box>
              <Stack spacing={1}>
                {proctors?.map((proctor, index) => (
                  <ProctorCard
                    key={proctor?.id}
                    index={index}
                    selectedIndex={selectedProctorIndex}
                    proctor={proctor}
                    handleClick={() => handleSelectProctor(proctor, index)}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DensityShotDetails;
