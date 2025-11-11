import { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import HeaderTitle from "@/components/headers/HeaderTitle";
import { jobsAPIService } from "@/services/apiService";
import { JobReadDTO } from "@/dtos/Job/job";
import { JobProjectManagerReadDTO } from "@/dtos/Job/jobProjectManager";

interface ContactDisplay {
  id: string;
  initials: string;
  name: string;
  role: string;
  isPlaceholder?: boolean;
}

interface RecentReportDisplay {
  id: number;
  initials: string;
  description: string;
  date: string;
}

const getInitials = (
  firstName?: string | null,
  lastName?: string | null,
  fallbackName?: string,
) => {
  const letters = [firstName, lastName]
    .filter((value): value is string => Boolean(value && value.trim()))
    .map((value) => value.trim().charAt(0).toUpperCase());

  if (letters.length) {
    return letters.join("").slice(0, 2);
  }

  if (fallbackName) {
    const fallbackLetters = fallbackName
      .split(" ")
      .filter(Boolean)
      .map((value) => value.trim().charAt(0).toUpperCase())
      .join("");

    if (fallbackLetters) {
      return fallbackLetters.slice(0, 2);
    }
  }

  return "?";
};

const formatDate = (isoDate?: string | null) => {
  if (!isoDate) {
    return "Date unavailable";
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(parsed);
};

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState<JobReadDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchJobDetails = async () => {
      if (!jobId) {
        setJobData(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await jobsAPIService.getJob(jobId);
        if (isMounted) {
          setJobData(response.data);
        }
      } catch (err) {
        console.error("Failed to load job details", err);
        if (isMounted) {
          setError("Unable to load job details right now.");
          setJobData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchJobDetails();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const contacts = useMemo<ContactDisplay[]>(() => {
    if (!jobData) {
      return [];
    }

    const contactDisplays: ContactDisplay[] = [];
    const projectManagers = jobData.projectManagers as
      | JobProjectManagerReadDTO[]
      | undefined;

    const primaryProjectManager =
      projectManagers?.find((pm) => pm?.isActive && pm.isPrimary) ??
      projectManagers?.find((pm) => pm?.isActive);

    if (primaryProjectManager) {
      const personalInfo = primaryProjectManager.personalInfo;
      const fullName =
        personalInfo
          ? `${personalInfo.firstName} ${personalInfo.lastName}`.trim()
          : primaryProjectManager.fullName;

      contactDisplays.push({
        id: `pm-${primaryProjectManager.id}`,
        initials: getInitials(
          personalInfo?.firstName,
          personalInfo?.lastName,
          primaryProjectManager.fullName,
        ),
        name: fullName || "Project Manager",
        role: primaryProjectManager.isPrimary
          ? "Primary Project Manager"
          : "Project Manager",
      });
    } else {
      contactDisplays.push({
        id: "pm-placeholder",
        initials: "PM",
        name: "Not assigned",
        role: "Project Manager",
        isPlaceholder: true,
      });
    }

    const primarySiteContact =
      jobData.siteContacts?.find((contact) => contact?.isActive && contact.isPrimary) ??
      jobData.siteContacts?.find((contact) => contact?.isActive);

    if (primarySiteContact) {
      const personalInfo = primarySiteContact.personalInfo;
      const fullName =
        personalInfo
          ? `${personalInfo.firstName} ${personalInfo.lastName}`.trim()
          : primarySiteContact.contactName;

      contactDisplays.push({
        id: `sc-${primarySiteContact.id}`,
        initials: getInitials(
          personalInfo?.firstName,
          personalInfo?.lastName,
          primarySiteContact.contactName,
        ),
        name: fullName || "Site Contact",
        role: primarySiteContact.role || "Site Contact",
      });
    } else {
      contactDisplays.push({
        id: "sc-placeholder",
        initials: "SC",
        name: "Not assigned",
        role: "Site Contact",
        isPlaceholder: true,
      });
    }

    return contactDisplays;
  }, [jobData]);

  const notes = useMemo(
    () =>
      jobData?.jobNotes
        ?.map((note) => note?.note)
        .filter((note): note is string => Boolean(note && note.trim())) ?? [],
    [jobData?.jobNotes],
  );

  const recentReports = useMemo<RecentReportDisplay[]>(() => {
    if (!jobData?.reports?.length) {
      return [];
    }

    const sortedReports = [...jobData.reports]
      .filter(
        (report): report is NonNullable<JobReadDTO["reports"]>[number] =>
          Boolean(report),
      )
      .sort((a, b) => {
        const aDate = new Date(a.submitDate ?? a.startDate ?? 0).getTime();
        const bDate = new Date(b.submitDate ?? b.startDate ?? 0).getTime();
        return bDate - aDate;
      })
      .slice(0, 2);

    return sortedReports.map((report) => {
      const employeeName = report.employeeName || "Unknown";
      const nameParts = employeeName
        .split(" ")
        .map((part) => part.trim())
        .filter(Boolean);
      const [firstName, ...rest] = nameParts;
      const lastName = rest.length ? rest[rest.length - 1] : undefined;

      return {
        id: report.id,
        initials: getInitials(firstName, lastName, employeeName),
        description: `Report #${report.reportNumber} by ${employeeName}`,
        date: formatDate(report.submitDate ?? report.startDate),
      };
    });
  }, [jobData?.reports]);

  const handleClickReport = (reportId: number) => {
    navigate(`report/${reportId}`);
  };

  const handleNewReport = () => {
    console.log("Create new report for job:", jobId);
  };

  const handleClickShowAll = () => {
    console.log("CLICK SHOW");
    navigate(`/job/${jobId}/all-reports`);
  };

  const handleAddressClick = () => {
    if (!jobData?.siteAddress) {
      return;
    }

    const encodedAddress = encodeURIComponent(jobData.siteAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId ?? ""}`}
        subtitle={jobData?.siteAddress ?? ""}
        onSubtitleClick={jobData?.siteAddress ? handleAddressClick : undefined}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        {isLoading && (
          <Typography color="text.secondary">Loading job details...</Typography>
        )}
        {!isLoading && error && (
          <Typography color="error" sx={{ my: 2 }}>
            {error}
          </Typography>
        )}

        {!isLoading && !error && jobData && (
          <>
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

                {notes.map((note, index) => (
                  <Box
                    key={`${note}-${index}`}
                    sx={{ mb: index < notes.length - 1 ? 2 : 0 }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      {note}
                    </Typography>
                    {index < notes.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}

                {!notes.length && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    No notes available for this job.
                  </Typography>
                )}
              </Card>
            </Box>

            {/* Recent Reports */}
            <Box sx={{ mb: 3 }}>
              <HeaderTitle
                title="Recent Reports"
                showAll={true}
                onClick={handleClickShowAll}
              />
              <Stack spacing={1}>
                {recentReports.map((report) => (
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

                {!recentReports.length && (
                  <Typography variant="body2" color="text.secondary">
                    No recent reports found.
                  </Typography>
                )}
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
          </>
        )}
      </Container>
    </>
  );
};

export default JobDetails;
