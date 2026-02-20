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
import { jobsApi } from "@/services/api/jobsApiService";
import { JobReadDTO } from "@/dtos/Job/job";
import { ApiResponse } from "@/types/api";
import { useEffect, useState } from "react";
import { ReportReadDTO } from "@/dtos/Reports/report";
import { JobNoteReadDTO } from "@/dtos/Job/jobNote";
import { JobSiteContactReadDTO } from "@/dtos/Job/jobSiteContact";

const JobDetails: React.FC = () => {
  const { jobNumber } = useParams<{ jobNumber: string }>();
  const navigate = useNavigate();

  const [jobData, setJob] = useState<JobReadDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobNumber) return;

      try {
        setLoading(true);
        // 3. Call your new service
        const data = await jobsApi.getByNumber(jobNumber);

        console.log("Successfully fetched job object:", data);
        setJob(data);
        setError(null);
      } catch (err: any) {
        // 'err' is the unwrapped ApiResponse from BaseApiService
        const apiError = err as ApiResponse<null>;
        console.error("Fetch error:", apiError);
        setError(apiError.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobNumber]);

  if (loading) return <div>Loading job details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!jobData) return <div>Job not found.</div>;

  const handleClickReport = (reportId: number) => {
    navigate(`report/${reportId}`);
  };

  const handleNewReport = () => {
    console.log("Create new report for job:", jobNumber);
  };

  const handleClickShowAll = () => {
    console.log("CLICK SHOW");
    navigate(`/job/${jobNumber}/all-reports`);
  };

  const handleAddressClick = () => {
    const encodedAddress = encodeURIComponent(jobData.siteAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobNumber}`}
        subtitle={`${jobData.siteAddress}`}
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
          {jobData.siteContacts?.map(
            (contact: JobSiteContactReadDTO, index) => (
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
                  {contact.personalInfo?.firstName}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {contact.personalInfo?.firstName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {contact.role}
                  </Typography>
                </Box>
              </Box>
            ),
          )}
        </Box>

        {/* Notes Section */}
        <Box sx={{ mb: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Notes</Typography>

            {jobData.jobNotes?.map((note: JobNoteReadDTO, index) => (
              <Box
                key={index}
                sx={{ mb: index < jobData.jobNotes!.length - 1 ? 2 : 0 }}
              >
                <Typography variant="body1" color="text.secondary">
                  {note.note}
                </Typography>
                {index < jobData.jobNotes!.length - 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
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
            {jobData.reports?.map((report: ReportReadDTO) => (
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
                    {report.reviewer?.firstName}
                  </Avatar>
                  <Box sx={{ width: "75%" }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Report {report.id}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                      {report.description}
                    </Typography> */}
                    <Typography
                      display="block"
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {report.submitDate}
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
