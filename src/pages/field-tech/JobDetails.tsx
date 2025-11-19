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
import { useEffect, useState } from "react";

import { reportApiService } from "@/services/reportApi";
import { jobsApiService } from "@/services/jobsApi";
import { JobReadDTO } from "@/types/dtos/Job/job";
import { JobProjectManagerReadDTO } from "@/types/dtos/Job/jobProjectManager";
import { JobNoteReadDTO } from "@/types/dtos/Job/jobNote";
import { ReportListDTO } from "@/types/dtos/report";
// Mock data
// const jobData = {
//   id: 1,
//   jobNumber: "000001",
//   address: "123 Main St, Vancouver, BC",
//   contacts: [
//     { id: 1, initials: "JS", name: "Jakub Szary", role: "Project Manager" },
//     { id: 2, initials: "MK", name: "Matt Kokan", role: "Site Contact" },
//   ],
//   notes: [
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam, quis nostrud exercitation ullamco",
//     "laboris nisi ut aliquip ex ea commodo consequat.",
//   ],

//   recentReports: [
//     {
//       id: 4,
//       initials: "IC",
//       description:
//         "Description duis aute irure dolor in reprehenderit in voluptate",
//       date: "Today",
//     },
//     {
//       id: 3,
//       initials: "PS",
//       description:
//         "Description duis aute irure dolor in reprehenderit in voluptate velit.",
//       date: "Two weeks ago",
//     },
//   ],
// };

const JobDetails: React.FC = () => {
  const { jobNumber } = useParams<{ jobNumber: string }>();
  const [jobReports, setJobReports] = useState<ReportListDTO[]>([]);
  const [jobData, setJobData] = useState<JobReadDTO | null>(null);
  const navigate = useNavigate();

  const handleClickReport = (reportId: number) => {
    navigate(`report/${reportId}`);
  };

  const handleNewReport = () => {
    navigate(`/field-tech/job/${jobNumber}/create-report`);
  };

  const handleClickShowAll = () => {
    console.log("CLICK SHOW");
    navigate(`/job/${jobNumber}/all-reports`);
  };

  // const handleAddressClick = () => {
  //   const encodedAddress = encodeURIComponent(jobReports.address);  // TODO: Job reports is missing address
  //   const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  //   window.open(googleMapsUrl, "_blank");
  // };

  useEffect(() => {
    const fetchJobReports = async () => {
      try {
        const response =
          await reportApiService.getReportsByJobNumber(jobNumber);
        setJobReports(response.data);
      } catch (err) {
        console.error("Error occured while fetching reports", err);
      }
    };

    const fetchJobData = async () => {
      console.log("Fetching job data for job number: ", jobNumber);
      try {
        const response = await jobsApiService.getJobByJobNumber(jobNumber);
        console.log("Job data response: ", response.data);
        setJobData(response.data);
      } catch (err) {
        console.error("Error occured while fetching job data", err);
      }
    };

    fetchJobReports();
    fetchJobData();
    console.log("Job Data: ", jobData);
  }, [jobNumber]);

  return (
    <>
      <HeaderWithBackButton
        title={`Job ${jobNumber}`}
        // subtitle={`${jobData.address}`}
        // onSubtitleClick={handleAddressClick}
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
          {jobData?.projectManagers?.map(
            (manager: JobProjectManagerReadDTO, index) => (
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
                  {manager.fullName.charAt(0) + manager.fullName.charAt(1)}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {manager.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {/* {contact.role} TODO: Add role */}
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

            {jobData?.jobNotes?.map((note: JobNoteReadDTO, index) => (
              <Box
                key={index}
                sx={{ mb: index < jobData?.jobNotes?.length - 1 ? 2 : 0 }}
              >
                <Typography variant="body1" color="text.secondary">
                  {note}
                </Typography>
                {index < jobData?.jobNotes.length - 1 && (
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
            {jobReports.map((report: ReportListDTO) => (
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
                      textColor: "white",
                      fontSize: "0.875rem",
                      mr: 2,
                    }}
                  >
                    {report.employee.firstName.charAt(0)}
                    {report.employee.lastName.charAt(0)}
                  </Avatar>
                  <Box sx={{ width: "75%" }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Report {report.reportNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {/* {report.description} */}
                    </Typography>
                    <Typography
                      display="block"
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {report.startDate}
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
