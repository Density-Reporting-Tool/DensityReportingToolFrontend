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
} from "@mui/material";
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const LabAdminAddProctor: React.FC = () => {
  const navigate = useNavigate();
  const [proctorType, setProctorType] = useState("MPDD");

  const handleProctorTypeChange = (event: SelectChangeEvent) => {
    setProctorType(event.target.value);
  };

  const handleNavigation = (section: string) => {
    switch (section) {
      case "schedule":
        navigate("/lab-admin");
        break;
      case "createJob":
        navigate("/lab-admin/create-job");
        break;
      default:
        break;
    }
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
        {/* Title Section */}
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
          {/* Avatar Circle */}
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
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
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
            {/* Schedule Button */}
            <Button
              variant="contained"
              onClick={() => handleNavigation("schedule")}
              sx={{
                backgroundColor: "white",
                color: "text.primary",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "grey.50",
                },
              }}
              startIcon={<ScheduleIcon />}
            >
              Schedule
            </Button>

            {/* Create Job Button */}
            <Button
              variant="contained"
              onClick={() => handleNavigation("createJob")}
              sx={{
                backgroundColor: "white",
                color: "text.primary",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "grey.50",
                },
              }}
              startIcon={<AddIcon />}
            >
              Create Job
            </Button>

            {/* Enter Proctor Button - Active State */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              startIcon={<PersonIcon />}
            >
              Enter Proctor
            </Button>
          </Stack>
        </Box>

        {/* Main Content Area - Proctor Data Entry Form */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "background.default",
            p: 4,
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Proctor Data Entry
          </Typography>

          <Box sx={{ maxWidth: 1200 }}>
            {/* Form Grid - Two Columns */}
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}
            >
              {/* Left Column */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Job # */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Job #
                  </Typography>
                  <TextField
                    fullWidth
                    value="22541"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>

                {/* Proctor Test # */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Proctor Test #
                  </Typography>
                  <TextField
                    fullWidth
                    value="13"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>

                {/* Material Type */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Material Type
                  </Typography>
                  <TextField
                    fullWidth
                    value="Riversand"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>

                {/* Date Sampled */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Date Sampled
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    variant="outlined"
                    size="small"
                    defaultValue="2025-08-08"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>

                {/* Proctor Type */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Proctor Type
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={proctorType}
                      onChange={handleProctorTypeChange}
                      sx={{
                        backgroundColor: "white",
                        borderRadius: 1,
                      }}
                    >
                      <MenuItem value="MPDD">MPDD</MenuItem>
                      <MenuItem value="Standard">Standard</MenuItem>
                      <MenuItem value="Modified">Modified</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Max Dry Density */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Max Dry Density
                  </Typography>
                  <TextField
                    fullWidth
                    value="1800 kg/m3"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>

                {/* Corrected Density */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Corrected Density
                  </Typography>
                  <TextField
                    fullWidth
                    value="1938 kg/m3"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Right Column */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Lab Location */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Lab Location
                  </Typography>
                  <TextField
                    fullWidth
                    value="Vancouver, BC"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>

                {/* Proctor ID # */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Proctor ID #
                  </Typography>
                  <TextField
                    fullWidth
                    value="12345"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
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
                    variant="outlined"
                    size="small"
                    defaultValue="2025-08-08"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>

                {/* Oversize Percentage */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Oversize Percentage
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      value="13.2"
                      variant="outlined"
                      size="small"
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          borderRadius: 1,
                        },
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      %
                    </Typography>
                  </Box>
                </Box>

                {/* Optimum Moisture */}
                <Box>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Optimum Moisture
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      value="13"
                      variant="outlined"
                      size="small"
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          borderRadius: 1,
                        },
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
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
                    value="2.7 Gs"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                Save Proctor Data
              </Button>
              <Button
                variant="outlined"
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
