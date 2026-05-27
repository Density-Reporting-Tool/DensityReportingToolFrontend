import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  Avatar,
  Button,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import HeaderTitle from "@/components/headers/HeaderTitle";
import { jobsAPIService } from "@/services/apiService";
import { reportsApiService } from "@/services/reportsApiService";
import { ReportListByJobResponse } from "@/dtos/report";
import { useAuthStore } from "@/stores/authStore";

interface PersonalInfo {
  firstName: string;
  lastName: string;
}

interface JobNote {
  id: number;
  note: string;
}

interface ProjectManager {
  id: number;
  personalInfo: PersonalInfo;
}

interface SiteContact {
  id: number;
  role?: string;
  personalInfo: PersonalInfo;
}

interface JobDetail {
  id: number;
  jobNumber: string;
  clientName: string;
  projectName: string;
  siteAddress: string;
  jobNotes: JobNote[];
  projectManagers: ProjectManager[];
  siteContacts: SiteContact[];
}

const JobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [reports, setReports] = useState<ReportListByJobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingReport, setCreatingReport] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const load = async () => {
      try {
        setLoading(true);
        const [jobRes, reportsRes] = await Promise.all([
          jobsAPIService.getJob(jobId),
          reportsApiService.getReportsByJob(jobId),
        ]);
        setJob(jobRes.data as unknown as JobDetail);
        setReports((reportsRes.data as unknown as ReportListByJobResponse[]) ?? []);
      } catch (err) {
        console.error("Error loading job details:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [jobId]);

  const handleClickReport = (reportId: number) => {
    navigate(`report/${reportId}`);
  };

  const handleNewReport = async () => {
    if (!job || creatingReport) return;
    try {
      setCreatingReport(true);
      const res = await reportsApiService.createReport({
        jobId: job.id,
        employeeId: user?.id ?? 1,
        startDate: new Date().toISOString(),
      });
      const newReport = res.data as unknown as { id: number; reportNumber: number; report?: { id: number } };
      const reportId = newReport?.report?.id ?? newReport?.id;
      navigate(`/field-tech/job/${jobId}/report/${reportId}`);
    } catch (err) {
      console.error("Failed to create report:", err);
    } finally {
      setCreatingReport(false);
    }
  };

  const handleClickShowAll = () => {
    navigate(`/job/${jobId}/all-reports`);
  };

  const handleAddressClick = () => {
    if (!job?.siteAddress) return;
    const encoded = encodeURIComponent(job.siteAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, "_blank");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !job) {
    return (
      <>
        <HeaderWithBackButton title={`Job #${jobId}`} />
        <Container maxWidth="xl" sx={{ my: 3 }}>
          <Typography color="error">{error ?? "Job not found."}</Typography>
        </Container>
      </>
    );
  }

  const fullName = (pi: PersonalInfo) =>
    `${pi.firstName} ${pi.lastName}`.trim();

  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const contacts = [
    ...(job.projectManagers ?? []).map((pm: ProjectManager) => ({
      id: `pm-${pm.id}`,
      name: fullName(pm.personalInfo),
      role: "Project Manager",
    })),
    ...(job.siteContacts ?? []).map((sc: SiteContact) => ({
      id: `sc-${sc.id}`,
      name: fullName(sc.personalInfo),
      role: sc.role ?? "Site Contact",
    })),
  ];

  const notes = (job.jobNotes ?? []).map((n: JobNote) => n.note);

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId}`}
        subtitle={job.siteAddress}
        onSubtitleClick={handleAddressClick}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        {/* Contact Information */}
        <Box
          sx={{
            my: 3,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {contacts.map((contact) => (
            <Box
              key={contact.id}
              sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}
            >
              <Avatar sx={{ width: 45, height: 45, bgcolor: "primary.main" }}>
                {initials(contact.name)}
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
        {notes.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Notes</Typography>
              {notes.map((note: string, index: number) => (
                <Box key={index} sx={{ mb: index < notes.length - 1 ? 2 : 0 }}>
                  <Typography variant="body1" color="text.secondary">
                    {note}
                  </Typography>
                  {index < notes.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Card>
          </Box>
        )}

        {/* Recent Reports */}
        <Box sx={{ mb: 3 }}>
          <HeaderTitle
            title="Recent Reports"
            showAll={true}
            onClick={handleClickShowAll}
          />
          <Stack spacing={1}>
            {reports.slice(0, 5).map((report: ReportListByJobResponse) => {
              const employeeName =
                `${report.employee?.firstName ?? ""} ${report.employee?.lastName ?? ""}`.trim();
              return (
                <Card
                  key={report.id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { boxShadow: 3 },
                    p: 2,
                    boxShadow: 0,
                    borderRadius: 2,
                  }}
                  onClick={() => handleClickReport(report.id)}
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
                      {initials(employeeName)}
                    </Avatar>
                    <Box sx={{ width: "75%" }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Report {report.reportNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {report.densityTestsCount} test
                        {report.densityTestsCount !== 1 ? "s" : ""},{" "}
                        {report.photosCount} photo
                        {report.photosCount !== 1 ? "s" : ""}
                      </Typography>
                      {report.startDate && (
                        <Typography
                          display="block"
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {new Date(report.startDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ChevronRightIcon color="action" />
                    </Box>
                  </Box>
                </Card>
              );
            })}
            {reports.length === 0 && (
              <Card sx={{ p: 2, borderRadius: 2 }}>No reports yet.</Card>
            )}
          </Stack>
        </Box>

        {/* New Report Button */}
        <Box sx={{ position: "fixed", bottom: 20, left: 20, right: 20 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={creatingReport ? undefined : <AddIcon />}
            disabled={creatingReport}
            onClick={handleNewReport}
            sx={{ py: 1.5, borderRadius: 3, boxShadow: 3 }}
          >
            {creatingReport ? "Creating…" : "New Report"}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default JobDetails;
