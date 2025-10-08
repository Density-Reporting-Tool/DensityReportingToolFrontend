import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import HeaderTitle from "@/components/headers/HeaderTitle";
import ContactSelectionDialog from "@/components/ContactSelectionDialog";
import { JobReadDTO } from "@/dtos/Job/job";
import { ReportReadDTO } from "@/dtos/report";
import { ContactData } from "@/types/contacts";
import { jobDetailsApiService } from "@/services/jobDetailsApiService";

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  // State management
  const [job, setJob] = useState<JobReadDTO | null>(null);
  const [reports, setReports] = useState<ReportReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Contact dialog state
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedContactType, setSelectedContactType] = useState<'projectManager' | 'siteContact' | null>(null);
  const [contactSelectionDialogOpen, setContactSelectionDialogOpen] = useState(false);
  const [contactSelectionType, setContactSelectionType] = useState<'projectManager' | 'siteContact' | null>(null);

  // Load job data and reports
  useEffect(() => {
    if (jobId) {
      loadJobData();
    }
  }, [jobId]);

  const loadJobData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load job details and reports in parallel
      const [jobResponse, reportsResponse] = await Promise.all([
        jobDetailsApiService.getJobDetails(jobId!),
        jobDetailsApiService.getRecentJobReports(jobId!, 5)
      ]);
      
      setJob(jobResponse.data);
      setReports(reportsResponse.data);
    } catch (err) {
      console.error("Error loading job data:", err);
      setError("Failed to load job details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    if (job?.siteAddress) {
      const encodedAddress = encodeURIComponent(job.siteAddress);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(googleMapsUrl, "_blank");
    }
  };

  const handleContactClick = (contactType: 'projectManager' | 'siteContact') => {
    setSelectedContactType(contactType);
    setContactDialogOpen(true);
  };

  const handleCloseContactDialog = () => {
    setContactDialogOpen(false);
    setSelectedContactType(null);
  };

  const handleOpenContactSelection = (contactType: 'projectManager' | 'siteContact') => {
    setContactSelectionType(contactType);
    setContactSelectionDialogOpen(true);
  };

  const handleCloseContactSelection = () => {
    setContactSelectionDialogOpen(false);
    setContactSelectionType(null);
  };

  const handleSelectContact = async (contact: ContactData) => {
    try {
      console.log(`Selected ${contactSelectionType}:`, contact);
      
      if (!job?.jobNumber) {
        console.error("No job number available");
        return;
      }

      if (contactSelectionType === 'projectManager') {
        await jobDetailsApiService.assignProjectManager(job.jobNumber, contact);
        console.log("Project manager assigned successfully");
      } else if (contactSelectionType === 'siteContact') {
        await jobDetailsApiService.assignSiteContact(job.jobNumber, contact);
        console.log("Site contact assigned successfully");
      }

      // Refresh job data to show the newly assigned contact
      await loadJobData();
      
      handleCloseContactSelection();
    } catch (error) {
      console.error("Error assigning contact:", error);
      // TODO: Show error message to user
    }
  };

  const handleRemoveProjectManager = async (projectManagerId: number) => {
    try {
      if (!job?.jobNumber) {
        console.error("No job number available");
        return;
      }

      await jobDetailsApiService.removeProjectManager(job.jobNumber, projectManagerId);
      console.log("Project manager removed successfully");
      
      // Refresh job data
      await loadJobData();
    } catch (error) {
      console.error("Error removing project manager:", error);
      // TODO: Show error message to user
    }
  };

  const handleRemoveSiteContact = async (siteContactId: number) => {
    try {
      if (!job?.jobNumber) {
        console.error("No job number available");
        return;
      }

      await jobDetailsApiService.removeSiteContact(job.jobNumber, siteContactId);
      console.log("Site contact removed successfully");
      
      // Refresh job data
      await loadJobData();
    } catch (error) {
      console.error("Error removing site contact:", error);
      // TODO: Show error message to user
    }
  };

  // Helper functions
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 14) return "Two weeks ago";
    return date.toLocaleDateString();
  };

  const getActiveProjectManager = () => {
    return job?.projectManagers?.filter(pm => pm.isActive)?.[0] || null;
  };

  const getActiveSiteContact = () => {
    return job?.siteContacts?.filter(sc => sc.isActive)?.[0] || null;
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <Container maxWidth="xl" sx={{ my: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Job not found"}
        </Alert>
        <Button onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${job.jobNumber}`}
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
          {/* Project Manager - Always Show */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "space-between",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
            onClick={() => handleContactClick('projectManager')}
          >
            <Avatar
              sx={{
                width: 45,
                height: 45,
                bgcolor: "primary.main",
              }}
            >
              {(() => {
                const activePM = getActiveProjectManager();
                return activePM ? getInitials(activePM.fullName) : "?";
              })()}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {(() => {
                  const activePM = getActiveProjectManager();
                  return activePM ? activePM.fullName : "No project manager assigned";
                })()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Project Manager
              </Typography>
            </Box>
          </Box>

          {/* Site Contact - Always Show */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "space-between",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
            onClick={() => handleContactClick('siteContact')}
          >
            <Avatar
              sx={{
                width: 45,
                height: 45,
                bgcolor: "secondary.main",
              }}
            >
              {(() => {
                const activeSC = getActiveSiteContact();
                return activeSC ? getInitials(activeSC.contactName || "Unknown") : "?";
              })()}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {(() => {
                  const activeSC = getActiveSiteContact();
                  return activeSC ? (activeSC.contactName || "Unknown Contact") : "No site contact assigned";
                })()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Site Contact
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Notes Section */}
        <Box sx={{ mb: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Notes</Typography>

            {job.jobNotes && job.jobNotes.length > 0 ? (
              job.jobNotes.map((note, index) => (
                <Box
                  key={note.id}
                  sx={{ mb: index < job.jobNotes!.length - 1 ? 2 : 0 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {note.note}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: "block" }}>
                    {new Date(note.createdDate).toLocaleDateString()}
                  </Typography>
                  {index < job.jobNotes!.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                No notes available for this job
              </Typography>
            )}
          </Card>
        </Box>

        {/* Recent Reports */}
        <Box sx={{ mb: 3 }}>
          <HeaderTitle
            title="Recent Reports"
            showAll={reports.length > 0}
            onClick={handleClickShowAll}
          />
          {reports.length > 0 ? (
            <Stack spacing={1}>
              {reports.map((report) => (
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
                      {getInitials(report.employeeName)}
                    </Avatar>
                    <Box sx={{ width: "75%" }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Report #{report.reportNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Employee: {report.employeeName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reviewer: {report.reviewerName}
                      </Typography>
                      <Typography
                        display="block"
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {formatDate(report.submitDate || report.startDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ChevronRightIcon color="action" />
                    </Box>
                  </Box>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", py: 2 }}>
              No reports available for this job
            </Typography>
          )}
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

      {/* Contact Details Dialog */}
      <Dialog
        open={contactDialogOpen}
        onClose={handleCloseContactDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            {selectedContactType === 'projectManager' ? 'Project Managers' : 'Site Contacts'}
          </Typography>
          <IconButton onClick={handleCloseContactDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {selectedContactType === 'projectManager' ? (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Project Managers for Job #{job?.jobNumber}
              </Typography>
              
              {job?.projectManagers && job.projectManagers.length > 0 ? (
                <List>
                  {job.projectManagers.map((manager) => (
                    <ListItem
                      key={manager.id}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        mb: 1,
                        opacity: manager.isActive ? 1 : 0.6,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: manager.isActive ? "primary.main" : "grey.400" }}>
                          {getInitials(manager.fullName)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={manager.fullName}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Start Date: {new Date(manager.startDate).toLocaleDateString()}
                              {manager.endDate && ` • End Date: ${new Date(manager.endDate).toLocaleDateString()}`}
                            </Typography>
                            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                              <Chip
                                label={manager.isActive ? "Active" : "Inactive"}
                                color={manager.isActive ? "success" : "default"}
                                size="small"
                              />
                              {manager.notes && (
                                <Chip
                                  label="Has Notes"
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {manager.isActive && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveProjectManager(manager.id)}
                            sx={{ color: "error.main" }}
                          >
                            <CloseIcon />
                          </IconButton>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No project managers assigned to this job
                  </Typography>
                  <Button variant="outlined" startIcon={<AddIcon />}>
                    Add Project Manager
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Site Contacts for Job #{job?.jobNumber}
              </Typography>
              
              {job?.siteContacts && job.siteContacts.length > 0 ? (
                <List>
                  {job.siteContacts.map((contact) => (
                    <ListItem
                      key={contact.id}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        mb: 1,
                        opacity: contact.isActive ? 1 : 0.6,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: contact.isActive ? "secondary.main" : "grey.400" }}>
                          {getInitials(contact.contactName || "Unknown")}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={contact.contactName || "Unknown Contact"}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {contact.company && `Company: ${contact.company}`}
                              {contact.role && ` • Role: ${contact.role}`}
                              {contact.area && ` • Area: ${contact.area}`}
                            </Typography>
                            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                              <Chip
                                label={contact.isPrimary ? "Primary" : "Secondary"}
                                color={contact.isPrimary ? "primary" : "default"}
                                size="small"
                              />
                              <Chip
                                label={contact.isActive ? "Active" : "Inactive"}
                                color={contact.isActive ? "success" : "default"}
                                size="small"
                              />
                              {contact.notes && (
                                <Chip
                                  label="Has Notes"
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {contact.isActive && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveSiteContact(contact.id)}
                            sx={{ color: "error.main" }}
                          >
                            <CloseIcon />
                          </IconButton>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No site contacts assigned to this job
                  </Typography>
                  <Button variant="outlined" startIcon={<AddIcon />}>
                    Add Site Contact
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseContactDialog}>
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => {
              handleCloseContactDialog();
              if (selectedContactType) {
                handleOpenContactSelection(selectedContactType);
              }
            }}
          >
            Add {selectedContactType === 'projectManager' ? 'Project Manager' : 'Site Contact'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contact Selection Dialog */}
      {contactSelectionType && (
        <ContactSelectionDialog
          open={contactSelectionDialogOpen}
          onClose={handleCloseContactSelection}
          onSelectContact={handleSelectContact}
          title={`Select ${contactSelectionType === 'projectManager' ? 'Project Manager' : 'Site Contact'}`}
          jobNumber={job?.jobNumber || ""}
        />
      )}
    </>
  );
};

export default JobDetails;
