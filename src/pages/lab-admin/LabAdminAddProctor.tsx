import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  SelectChangeEvent,
  Stack,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { proctorApi } from "@/services/api/proctorApiService";
import { ProctorCreateDTO } from "@/dtos/Proctor/proctor";

const PROCTOR_TYPES = [
  { id: 1, label: "Standard" },
  { id: 2, label: "Modified" },
];

interface FormData {
  proctorID: string;
  proctorTestNumber: string;
  jobNumber: string;
  labTestId: number | null;
  sieveId: number | null;
  proctorTypeId: number;
  materialType: string;
  labLocation: string;
  dateSampled: string | null;
  dateTested: string | null;
  maxDensity: number | null;
  correctedDensity: number | null;
  optimumMoistureContent: number | null;
  specificGravity: number | null;
  oversizePercentage: number | null;
}

const emptyForm = (): FormData => ({
  proctorID: "",
  proctorTestNumber: "",
  jobNumber: "",
  labTestId: null,
  sieveId: null,
  proctorTypeId: 1,
  materialType: "",
  labLocation: "",
  dateSampled: null,
  dateTested: null,
  maxDensity: null,
  correctedDensity: null,
  optimumMoistureContent: null,
  specificGravity: null,
  oversizePercentage: null,
});

const LabAdminAddProctor: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(emptyForm());
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProctorTypeChange = (event: SelectChangeEvent<number>) => {
    handleInputChange("proctorTypeId", Number(event.target.value));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!formData.proctorID?.trim()) errors.push("Proctor ID is required");
    if (!formData.materialType?.trim()) errors.push("Material type is required");
    if (!formData.labLocation?.trim()) errors.push("Lab location is required");
    if (!formData.proctorTypeId || formData.proctorTypeId <= 0)
      errors.push("Proctor type is required");
    if (!formData.jobNumber?.trim() && (!formData.labTestId || formData.labTestId <= 0))
      errors.push("Either a Job Number or Lab Test ID is required");
    if (
      formData.maxDensity != null &&
      (formData.maxDensity < 0 || formData.maxDensity > 3000)
    )
      errors.push("Max density must be between 0 and 3000");
    if (
      formData.correctedDensity != null &&
      (formData.correctedDensity < 0 || formData.correctedDensity > 3000)
    )
      errors.push("Corrected density must be between 0 and 3000");
    if (
      formData.optimumMoistureContent != null &&
      (formData.optimumMoistureContent < 0 ||
        formData.optimumMoistureContent > 100)
    )
      errors.push("Optimum moisture content must be between 0 and 100");
    if (
      formData.oversizePercentage != null &&
      (formData.oversizePercentage < 0 || formData.oversizePercentage > 100)
    )
      errors.push("Oversize percentage must be between 0 and 100");
    if (
      formData.specificGravity != null &&
      (formData.specificGravity < 0 || formData.specificGravity > 10)
    )
      errors.push("Specific gravity must be between 0 and 10");
    if (formData.dateSampled && formData.dateTested) {
      if (new Date(formData.dateTested) < new Date(formData.dateSampled))
        errors.push("Date tested must be on or after date sampled");
    }
    return errors;
  };

  const buildCreateDTO = (): ProctorCreateDTO => {
    const base = {
      proctorID: formData.proctorID,
      proctorTestNumber: formData.proctorTestNumber,
      sieveId: formData.sieveId,
      proctorTypeId: formData.proctorTypeId,
      materialType: formData.materialType,
      labLocation: formData.labLocation,
      dateSampled: formData.dateSampled,
      dateTested: formData.dateTested,
      maxDensity: formData.maxDensity,
      correctedDensity: formData.correctedDensity,
      optimumMoistureContent: formData.optimumMoistureContent,
      specificGravity: formData.specificGravity,
      oversizePercentage: formData.oversizePercentage,
    };
    // If a lab test ID is provided, use it directly (links to existing lab test).
    // Otherwise, send the job number and let the backend create a new lab test.
    if (formData.labTestId && formData.labTestId > 0) {
      return { ...base, labTestId: formData.labTestId };
    }
    return { ...base, jobNumber: formData.jobNumber };
  };

  const handleSaveProctor = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const errors = validate();
    if (errors.length > 0) {
      setErrorMessage(errors.join(" · "));
      return;
    }

    try {
      setIsLoading(true);
      await proctorApi.create(buildCreateDTO());
      setSuccessMessage("Proctor saved successfully.");
      setFormData(emptyForm());
    } catch (err: any) {
      const base = err?.message || "Failed to save proctor.";
      const detail = err?.errors?.length ? ` — ${(err.errors as string[]).join(", ")}` : "";
      setErrorMessage(base + detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData(emptyForm());
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
      borderRadius: 1,
    },
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header Bar */}
      <Box
        sx={{
          height: 64,
          backgroundColor: "primary.main",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: "primary.dark",
            height: "100%",
            display: "flex",
            alignItems: "center",
            px: 3,
            minWidth: 200,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "white",
              color: "primary.main",
              fontWeight: "bold",
              fontSize: "1.2rem",
              width: 40,
              height: 40,
              mr: 2,
            }}
          >
            LA
          </Avatar>
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}
          >
            Lab Admin
          </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Left Sidebar */}
        <Box
          sx={{
            width: 200,
            backgroundColor: "grey.100",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
          }}
        >
          <Stack spacing={2} sx={{ width: "90%" }}>
            <Button
              variant="contained"
              onClick={() => handleNavigation("/lab-admin/schedule")}
              startIcon={<ScheduleIcon />}
              sx={{
                backgroundColor: "white",
                color: "text.primary",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": { backgroundColor: "grey.50", boxShadow: "none" },
              }}
            >
              Schedule
            </Button>

            <Button
              variant="contained"
              onClick={() => handleNavigation("/lab-admin/create-job")}
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "white",
                color: "text.primary",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": { backgroundColor: "grey.50", boxShadow: "none" },
              }}
            >
              Create Job
            </Button>

            {/* Active: Enter Proctor */}
            <Button
              variant="contained"
              startIcon={<PersonIcon />}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              Enter Proctor
            </Button>

            <Button
              variant="contained"
              onClick={() => handleNavigation("/lab-admin/proctors")}
              startIcon={<ListIcon />}
              sx={{
                backgroundColor: "white",
                color: "text.primary",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": { backgroundColor: "grey.50", boxShadow: "none" },
              }}
            >
              View Proctors
            </Button>
          </Stack>
        </Box>

        {/* Form Area */}
        <Box sx={{ flex: 1, backgroundColor: "background.default", p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Proctor Data Entry
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          )}

          <Box sx={{ maxWidth: 1200 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {/* Left Column */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Proctor ID */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Proctor ID *
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.proctorID}
                    onChange={(e) => handleInputChange("proctorID", e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Box>

                {/* Proctor Test # */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Proctor Test #
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.proctorTestNumber}
                    onChange={(e) => handleInputChange("proctorTestNumber", e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Box>

                {/* Job Number */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Job Number
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g. 25482"
                    value={formData.jobNumber}
                    onChange={(e) => handleInputChange("jobNumber", e.target.value)}
                    variant="outlined"
                    size="small"
                    helperText="A new Lab Test will be created and linked to this job"
                    sx={fieldSx}
                  />
                </Box>

                {/* Lab Test ID */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Lab Test ID
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="e.g. 5"
                    value={formData.labTestId ?? ""}
                    onChange={(e) =>
                      handleInputChange("labTestId", parseInt(e.target.value) || null)
                    }
                    variant="outlined"
                    size="small"
                    helperText="Link to an existing Lab Test (takes priority over Job Number)"
                    sx={fieldSx}
                  />
                </Box>

                {/* Material Type */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Material Type *
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.materialType}
                    onChange={(e) => handleInputChange("materialType", e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Box>

                {/* Lab Location */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Lab Location *
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.labLocation}
                    onChange={(e) => handleInputChange("labLocation", e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Box>

                {/* Proctor Type */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Proctor Type *
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.proctorTypeId}
                      onChange={handleProctorTypeChange}
                      sx={{ backgroundColor: "white", borderRadius: 1 }}
                    >
                      {PROCTOR_TYPES.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                          {t.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Date Sampled */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Date Sampled
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    value={formData.dateSampled ?? ""}
                    onChange={(e) =>
                      handleInputChange("dateSampled", e.target.value || null)
                    }
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                </Box>

                {/* Date Tested */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Date Tested
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    value={formData.dateTested ?? ""}
                    onChange={(e) =>
                      handleInputChange("dateTested", e.target.value || null)
                    }
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                </Box>
              </Box>

              {/* Right Column */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Max Density */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Max Density (kg/m³)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={formData.maxDensity ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "maxDensity",
                        e.target.value === "" ? null : parseFloat(e.target.value),
                      )
                    }
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Box>

                {/* Corrected Density */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Corrected Density (kg/m³)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={formData.correctedDensity ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "correctedDensity",
                        e.target.value === "" ? null : parseFloat(e.target.value),
                      )
                    }
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Box>

                {/* Optimum Moisture Content */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Optimum Moisture Content
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      type="number"
                      value={formData.optimumMoistureContent ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "optimumMoistureContent",
                          e.target.value === "" ? null : parseFloat(e.target.value),
                        )
                      }
                      variant="outlined"
                      size="small"
                      sx={{ flex: 1, ...fieldSx }}
                    />
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      %
                    </Typography>
                  </Box>
                </Box>

                {/* Oversize Percentage */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Oversize Percentage
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      type="number"
                      value={formData.oversizePercentage ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "oversizePercentage",
                          e.target.value === "" ? null : parseFloat(e.target.value),
                        )
                      }
                      variant="outlined"
                      size="small"
                      sx={{ flex: 1, ...fieldSx }}
                    />
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      %
                    </Typography>
                  </Box>
                </Box>

                {/* Specific Gravity */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Specific Gravity
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={formData.specificGravity ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "specificGravity",
                        e.target.value === "" ? null : parseFloat(e.target.value),
                      )
                    }
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleSaveProctor}
                disabled={isLoading}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                {isLoading ? "Saving..." : "Save Proctor Data"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearForm}
                disabled={isLoading}
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "primary.dark",
                    backgroundColor: "primary.50",
                  },
                }}
              >
                Clear Form
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LabAdminAddProctor;
