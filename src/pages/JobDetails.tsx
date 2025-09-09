import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import { apiService } from "../services/apiService";

// Types for job data - matching the actual API response structure
interface JobDetailsData {
  id: number;
  jobNumber: string;
  clientName: string;
  projectName: string;
  siteAddress: string;
  startDate: string | null;
  endDate: string | null;
  projectManagers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }>;
  siteContacts: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    company: string;
    role: string;
    isPrimary: boolean;
  }>;
  jobNotes: Array<{
    id: number;
    note: string;
    createdDate: string;
  }>;
}

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState<JobDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    if (!jobId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getJob(jobId);
      setJobData(response.data);
    } catch (err: any) {
      console.error('Error fetching job details:', err);
      setError(err.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };


  const handleNewReport = () => {
    console.log("Create new report for job:", jobId);
  };

  const handleAddressClick = () => {
    if (!jobData?.siteAddress) return;
    const encodedAddress = encodeURIComponent(jobData.siteAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate(-1)} variant="outlined">
          Go Back
        </Button>
      </Container>
    );
  }

  if (!jobData) {
    return (
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Job not found
        </Alert>
        <Button onClick={() => navigate(-1)} variant="outlined">
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobData.jobNumber}`}
        subtitle={`${jobData.siteAddress}`}
        onSubtitleClick={handleAddressClick}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        {/* Job Information */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            {jobData.projectName}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  <strong>Client:</strong> {jobData.clientName}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  <strong>Address:</strong> {jobData.siteAddress}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  <strong>Start Date:</strong> {formatDate(jobData.startDate)}
                </Typography>
              </Box>
              
              {jobData.endDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    <strong>End Date:</strong> {formatDate(jobData.endDate)}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Card>

        {/* Contact Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Project Managers
          </Typography>
          <Grid container spacing={2}>
            {jobData.projectManagers.map((pm) => (
              <Grid item xs={12} sm={6} md={4} key={pm.id}>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
                      {getInitials(pm.firstName, pm.lastName)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {pm.firstName} {pm.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Project Manager
                      </Typography>
                    </Box>
                  </Box>
                  {pm.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {pm.email}
                      </Typography>
                    </Box>
                  )}
                  {pm.phoneNumber && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {pm.phoneNumber}
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
            {jobData.projectManagers.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No project managers assigned
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Site Contacts */}
        {jobData.siteContacts.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Site Contacts
            </Typography>
            <Grid container spacing={2}>
              {jobData.siteContacts.map((contact) => (
                <Grid item xs={12} sm={6} md={4} key={contact.id}>
                  <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'secondary.main' }}>
                        {getInitials(contact.firstName, contact.lastName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {contact.firstName} {contact.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {contact.role} {contact.isPrimary && '(Primary)'}
                        </Typography>
                      </Box>
                    </Box>
                    {contact.company && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {contact.company}
                      </Typography>
                    )}
                    {contact.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {contact.email}
                        </Typography>
                      </Box>
                    )}
                    {contact.phoneNumber && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {contact.phoneNumber}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Notes Section */}
        {jobData.jobNotes.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Job Notes
            </Typography>
            <Card sx={{ p: 2 }}>
              {jobData.jobNotes.map((note, index) => (
                <Box
                  key={note.id}
                  sx={{ mb: index < jobData.jobNotes.length - 1 ? 2 : 0 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {note.note}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {formatDate(note.createdDate)}
                  </Typography>
                  {index < jobData.jobNotes.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Card>
          </Box>
        )}

        {/* Recent Reports - Placeholder for future implementation */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Recent Reports
          </Typography>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No reports available yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Reports will appear here once they are created for this job
            </Typography>
          </Card>
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
