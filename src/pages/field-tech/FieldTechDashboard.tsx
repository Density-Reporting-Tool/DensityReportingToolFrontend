import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  InputAdornment,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { apiService } from "@/services/apiService";
import { reportsApiService } from "@/services/reportsApiService";
import { ENDPOINTS } from "@/config/endpoints";
import { ReportListByJobResponse } from "@/dtos/report";
import { useAuthStore } from "@/stores/authStore";

interface ScheduleEvent {
  id: number;
  jobId: number;
  personalInfoId: number;
  startDateTime: string;
  endDateTime: string;
  description?: string;
  status?: string;
  job: { id: number; jobNumber: string; projectName: string; clientName: string };
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const groupByDate = (events: ScheduleEvent[]) => {
  const groups: Record<string, ScheduleEvent[]> = {};
  for (const e of events) {
    const key = formatDate(e.startDateTime);
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }
  return groups;
};

const groupByMonth = (reports: ReportListByJobResponse[]) => {
  const groups: Record<string, ReportListByJobResponse[]> = {};
  for (const r of reports) {
    const key = r.startDate
      ? new Date(r.startDate).toLocaleString("default", { month: "long", year: "numeric" })
      : "No date";
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }
  return groups;
};

const FieldTechDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [reports, setReports] = useState<ReportListByJobResponse[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setScheduleLoading(true);
        const now = new Date();
        // Fetch from start of yesterday through 90 days ahead
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0).toISOString();
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 90, 0, 0, 0).toISOString();
        let url = `${ENDPOINTS.SCHEDULING.EVENTS}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
        if (user) url += `&personalInfoId=${user.id}`;
        const res = await apiService.get<ScheduleEvent[]>(url);
        const events = (res.data as unknown as ScheduleEvent[]) ?? [];
        // Sort ascending by start time
        events.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
        setSchedule(events);
      } catch (err) {
        console.error("Failed to load schedule:", err);
        setSchedule([]);
      } finally {
        setScheduleLoading(false);
      }
    };

    const loadReports = async () => {
      try {
        setReportsLoading(true);
        const res = await reportsApiService.getAllReports();
        const all = (res.data as unknown as ReportListByJobResponse[]) ?? [];
        const mine = user
          ? all.filter((r) => r.employee?.id === user.id && !r.submitDate)
          : all.filter((r) => !r.submitDate);
        setReports(mine);
      } catch {
        setReports([]);
      } finally {
        setReportsLoading(false);
      }
    };

    loadSchedule();
    loadReports();
  }, [user]);

  const handleJobClick = (jobNumber: string) => {
    navigate(`job/${jobNumber}`);
  };

  const handleReportClick = (jobNumber: string, reportId: number) => {
    navigate(`job/${jobNumber}/report/${reportId}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`job/${searchValue.trim()}`);
    }
  };

  const scheduleGroups = groupByDate(schedule);
  const reportGroups = groupByMonth(reports);

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "center" }}>
          <Box
            component="img"
            sx={{ width: "100%", height: "auto", maxWidth: 250 }}
            alt="GeoPacific logo"
            src="/assets/Geo_Logo_Landscape_WithConsultants_Lrg.png"
          />
        </Box>

        {user && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 1 }}>
            Signed in as {user.firstName} {user.lastName}
          </Typography>
        )}

        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            placeholder="Enter Job Number"
            variant="outlined"
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10, backgroundColor: "white" } }}
          />
        </Box>
      </Box>

      {/* Upcoming Schedule */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
          <ScheduleIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">Upcoming Schedule</Typography>
        </Box>

        {scheduleLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : schedule.length === 0 ? (
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: 0, border: "1px lightgray solid" }}>
            <Typography variant="body2" color="text.secondary">No upcoming jobs scheduled.</Typography>
          </Card>
        ) : (
          Object.entries(scheduleGroups).map(([dateLabel, dayEvents]) => (
            <Box key={dateLabel} sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
                {dateLabel}
              </Typography>
              <Stack spacing={1}>
                {dayEvents.map((event) => (
                  <Box
                    key={event.id}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 56, textAlign: "right" }}>
                      {formatTime(event.startDateTime)}
                    </Typography>
                    <Card
                      sx={{
                        cursor: "pointer",
                        "&:hover": { boxShadow: 2 },
                        flexGrow: 1,
                        borderRadius: 2,
                        padding: 1.5,
                        boxShadow: 0,
                        border: "1px lightgray solid",
                      }}
                      onClick={() => handleJobClick(event.job.jobNumber)}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="body1">Job #{event.job.jobNumber}</Typography>
                          {event.job.projectName && (
                            <Typography variant="caption" color="text.secondary">{event.job.projectName}</Typography>
                          )}
                        </Box>
                        {event.status && (
                          <Chip label={event.status} size="small" variant="outlined" />
                        )}
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))
        )}
      </Box>

      {/* Reports In Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 1 }}>
          <AssessmentIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">Reports In Progress</Typography>
        </Box>

        {reportsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : reports.length === 0 ? (
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: 0, border: "1px lightgray solid" }}>
            <Typography variant="body2" color="text.secondary">No reports in progress.</Typography>
          </Card>
        ) : (
          Object.entries(reportGroups).map(([period, periodReports]) => (
            <Box key={period} sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                {period}
              </Typography>
              <Stack spacing={1}>
                {periodReports.map((report) => (
                  <Card
                    key={report.id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { boxShadow: 3 },
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      boxShadow: 0,
                      border: "1px lightgray solid",
                    }}
                    onClick={() => handleReportClick(report.job?.jobNumber ?? String(report.jobId), report.id)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Job #{report.job?.jobNumber ?? report.jobId}
                        </Typography>
                        <Typography variant="body2">Report #{report.reportNumber}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {report.densityTestsCount} test{report.densityTestsCount !== 1 ? "s" : ""},{" "}
                          {report.photosCount} photo{report.photosCount !== 1 ? "s" : ""}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default FieldTechDashboard;
