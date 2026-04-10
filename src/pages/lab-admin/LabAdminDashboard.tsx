import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Avatar, Stack } from "@mui/material";
import {
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Person as PersonIcon,
  List as ListIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

const NAV_ITEMS = [
  { label: "Schedule", icon: <ScheduleIcon />, path: "/lab-admin/schedule" },
  { label: "Create Job", icon: <AddIcon />, path: "/lab-admin/create-job" },
  { label: "Enter Proctor", icon: <PersonIcon />, path: "/lab-admin/add-proctor" },
  { label: "View Proctors", icon: <ListIcon />, path: "/lab-admin/proctors" },
  { label: "People", icon: <PeopleIcon />, path: "/lab-admin/people" },
];

const LabAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar */}
        <Box
          sx={{
            width: 200,
            backgroundColor: "grey.100",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
            flexShrink: 0,
          }}
        >
          <Stack spacing={2} sx={{ width: "90%" }}>
            {NAV_ITEMS.map(({ label, icon, path }) => (
              <Button
                key={path}
                variant="contained"
                onClick={() => navigate(path)}
                startIcon={icon}
                sx={
                  isActive(path)
                    ? {
                        backgroundColor: "primary.main",
                        color: "white",
                        fontWeight: "bold",
                        py: 1.5,
                        borderRadius: 2,
                        "&:hover": { backgroundColor: "primary.dark" },
                      }
                    : {
                        backgroundColor: "white",
                        color: "text.primary",
                        fontWeight: "bold",
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: "none",
                        "&:hover": { backgroundColor: "grey.50", boxShadow: "none" },
                      }
                }
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "background.default",
            borderLeft: "1px solid",
            borderColor: "grey.200",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default LabAdminDashboard;
