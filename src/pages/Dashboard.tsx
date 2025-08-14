import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

// Mock data
const todaysSchedule = [
  { id: 1, time: "7:00am", jobNumber: "000001" },
  { id: 2, time: "9:00am", jobNumber: "000002" },
  { id: 3, time: "5:00pm", jobNumber: "000003" },
];

const reportsInProgress = [
  {
    id: 1,
    period: "May 1 - May 31",
    reports: [
      { id: 1, jobNumber: "000101", reportNumber: "2" },
      { id: 2, jobNumber: "000102", reportNumber: "15" },
      { id: 3, jobNumber: "000103", reportNumber: "7" },
      { id: 4, jobNumber: "000104", reportNumber: "35" },
    ],
  },
  {
    id: 2,
    period: "June 1 - June 30",
    reports: [
      { id: 5, jobNumber: "000001", reportNumber: "4" },
      {
        id: 6,
        jobNumber: "000021",
        reportNumber: "4",
        note: "Jakub - Needs Edits",
      },
    ],
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleJobClick = (jobNumber: string) => {
    navigate(`/job/${jobNumber}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ alignItems: "center", mb: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, textAlign: "center" }}
          >
            GEOPACIFIC
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            placeholder="Enter Job Number"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 10,
                backgroundColor: "white",
              },
            }}
          />
        </Box>
      </Box>

      {/* Today's Schedule */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mb: 1,
          }}
        >
          <ScheduleIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">Today's Schedule</Typography>
        </Box>
        <Stack spacing={1}>
          {todaysSchedule.map((schedule) => (
            <Box
              key={schedule.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                {schedule.time}
              </Typography>

              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": { boxShadow: 2 },
                  flexGrow: 1,
                  borderRadius: 2,
                  padding: "14px",
                  boxShadow: 0,
                  border: "1px gray solid",
                }}
                onClick={() => handleJobClick(schedule.jobNumber)}
              >
                <Typography variant="body1">
                  Job #{schedule.jobNumber}
                </Typography>
              </Card>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Reports In Progress */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mb: 1,
          }}
        >
          <AssessmentIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6"> Reports In Progress</Typography>
        </Box>

        {reportsInProgress.map((period) => (
          <Box key={period.id} sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {period.period}
              </Typography>
            </Box>

            <Stack spacing={1}>
              {period.reports.map((report) => (
                <Card
                  key={report.id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { boxShadow: 3 },
                    flexGrow: 1,
                    borderRadius: 2,
                    padding: "14px 20px",
                    boxShadow: 0,
                    border: "1px gray solid",
                  }}
                  onClick={() => handleJobClick(report.jobNumber)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Job #{report.jobNumber}
                        </Typography>
                        <Typography variant="body2">
                          Report #{report.reportNumber}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {report.note && (
                          <Typography variant="body2" color="error">
                            {report.note}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Dashboard;
