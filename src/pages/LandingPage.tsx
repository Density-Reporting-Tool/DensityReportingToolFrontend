import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Science as ScienceIcon,
} from "@mui/icons-material";
import BackendStatus from "../components/BackendStatus";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Box
          component="img"
          sx={{
            width: "100%",
            height: "auto",
            maxWidth: 100,
            mb: 4,
          }}
          alt="GeoPacific logo"
          src="/assets/Geo_Logo_Portrait_WithConsultants_Lrg.png"
        />
        <Typography variant="h5" color="text" sx={{ mb: 1 }}>
          Density Reporting Tool 2
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Welcome to the GEOPACIFIC Density Reporting Tool. Choose your
          dashboard to get started. 2
        </Typography>
      </Box>

      {/* Navigation Cards */}
      <Grid container spacing={4} justifyContent="center">
        {/* Dashboard Card */}
        <Grid item xs={12} sm={6} md={5}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 8,
              },
            }}
            onClick={() => handleNavigation("/field-tech-dashboard")}
          >
            <CardContent
              sx={{
                textAlign: "center",
                py: 4,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <DashboardIcon
                  sx={{ fontSize: 64, color: "primary.main", mb: 3 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                  Field Tech Dashboard
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Access job schedules, reports in progress, and density
                  reporting tools.
                </Typography>
              </Box>
              <Button variant="contained" size="large" sx={{ px: 4, py: 1.5 }}>
                Enter Dashboard
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Lab Admin Dashboard Card */}
        <Grid item xs={12} sm={6} md={5}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 8,
              },
            }}
            onClick={() => handleNavigation("/lab-admin")}
          >
            <CardContent
              sx={{
                textAlign: "center",
                py: 4,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <ScienceIcon
                  sx={{ fontSize: 64, color: "primary.main", mb: 3 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                  Lab Admin Dashboard
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Manage schedules, jobs, and lab test results.
                </Typography>
              </Box>
              <Button variant="contained" size="large" sx={{ px: 4, py: 1.5 }}>
                Enter Dashboard
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Info */}
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Paper sx={{ p: 3, backgroundColor: "grey.50" }}>
          <Typography variant="body2" color="text.secondary">
            This is a temporary landing page. Choose your destination above to
            access the main application.
          </Typography>
        </Paper>
      </Box>

      {/* Backend Status (for testing) */}
      <Box sx={{ mt: 4 }}>
        <BackendStatus />
      </Box>
    </Container>
  );
};

export default LandingPage;
