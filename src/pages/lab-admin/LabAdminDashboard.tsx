import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Avatar, Stack } from "@mui/material";
import {
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const LabAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleSchedule = () => {
    navigate("/lab-admin/schedule");
  };

  const handleCreateJob = () => {
    navigate("/lab-admin/create-job");
  };

  const handleEnterProctor = () => {
    navigate("/lab-admin/add-proctor");
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
              onClick={handleSchedule}
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
              startIcon={<ScheduleIcon />}
            >
              Schedule
            </Button>

            {/* Create Job Button */}
            <Button
              variant="contained"
              onClick={handleCreateJob}
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
              startIcon={<AddIcon />}
            >
              Create Job
            </Button>

            {/* Enter Proctor Button */}
            <Button
              variant="contained"
              onClick={handleEnterProctor}
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

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "background.default",
            borderLeft: "1px solid grey.300",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default LabAdminDashboard;
