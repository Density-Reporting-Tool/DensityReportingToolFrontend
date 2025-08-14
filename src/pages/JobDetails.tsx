import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";

// Mock data
const jobData = {
  id: 1,
  jobNumber: "000001",
  address: "123 Main St, Vancouver, BC",
  contacts: [
    { id: 1, initials: "JS", name: "Jakub Szary", role: "Project Manager" },
    { id: 2, initials: "MK", name: "Matt Kokan", role: "Site Contact" },
  ],
  notes: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam, quis nostrud exercitation ullamco",
    "laboris nisi ut aliquip ex ea commodo consequat.",
  ],

  recentReports: [
    {
      id: 4,
      initials: "IC",
      description:
        "Description duis aute irure dolor in reprehenderit in voluptate",
      date: "Today",
    },
    {
      id: 3,
      initials: "PS",
      description:
        "Description duis aute irure dolor in reprehenderit in voluptate velit.",
      date: "Two weeks ago",
    },
  ],
};

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();

  const handleNewReport = () => {
    // Handle new report creation
    console.log("Create new report for job:", jobId);
  };

  const handleAddressClick = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobData.jobNumber}`}
        subtitle={`${jobData.address}`}
        onSubtitleClick={handleAddressClick}
      />
      <Container maxWidth="xl" sx={{ my: 2, mb: 12 }}>
        {/* Contact Information */}
        <Box
          sx={{
            my: 3,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {jobData.contacts.map((contact, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "space-between",
              }}
            >
              <Avatar
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: "primary.main",
                }}
              >
                {contact.initials}
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {contact.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {contact.role}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Notes Section */}
        <Box sx={{ mb: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Notes</Typography>

            {jobData.notes.map((note, index) => (
              <Box
                key={index}
                sx={{ mb: index < jobData.notes.length - 1 ? 2 : 0 }}
              >
                <Typography variant="body1" color="text.secondary">
                  {note}
                </Typography>
                {index < jobData.notes.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Card>
        </Box>

        {/* Recent Reports */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              position: "relative",
            }}
          >
            <Typography variant="h6">Recent Reports</Typography>
            <Typography
              variant="body2"
              color="secondary.main"
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Show all
            </Typography>
          </Box>

          <Stack spacing={1}>
            {jobData.recentReports.map((report) => (
              <Card
                key={report.id}
                sx={{
                  cursor: "pointer",
                  "&:hover": { boxShadow: 3 },
                  p: 2,
                  boxShadow: 0,
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "primary.main",
                      fontSize: "0.875rem",
                      mr: 2,
                    }}
                  >
                    {report.initials}
                  </Avatar>
                  <Box sx={{ width: "75%" }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Report {report.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {report.description}
                    </Typography>
                    <Typography
                      display="block"
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {report.date}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ChevronRightIcon color="action" />
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* New Report Button */}
        <Box sx={{ position: "fixed", bottom: 20, left: 20, right: 20 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewReport}
            sx={{
              py: 1.5,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            New Report
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default JobDetails;
