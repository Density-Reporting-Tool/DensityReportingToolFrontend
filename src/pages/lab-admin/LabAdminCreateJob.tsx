import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Autocomplete,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import DistributionListManager, {
  Contact,
} from "../../components/DistributionListManager";
import ContactForm from "../../components/ContactForm";
import { ContactData } from "@/types/contacts";
import { contactApiService } from "@/services/contactApiService";
import { jobsAPIService } from "@/services/apiService";
import { JobCreateDTO } from "@/dtos/Job/job";

const LabAdminCreateJob: React.FC = () => {
  const navigate = useNavigate();
  const [projectManager, setProjectManager] = useState("");
  const [siteContact, setSiteContact] = useState("");
  const [client, setClient] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [jobNotes, setJobNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [projectManagerContactDialogOpen, setProjectManagerContactDialogOpen] = useState(false);
  const [siteContactDialogOpen, setSiteContactDialogOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactManagerOpen, setContactManagerOpen] = useState(false);
  
  // Dynamic contact options for autocomplete
  const [allContacts, setAllContacts] = useState<ContactData[]>([]);
  const [projectManagerOptions, setProjectManagerOptions] = useState<ContactData[]>([]);
  const [siteContactOptions, setSiteContactOptions] = useState<ContactData[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isSavingJob, setIsSavingJob] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load initial contacts when component mounts
  useEffect(() => {
    loadInitialContacts();
  }, []);

  const handleNavigation = (section: string) => {
    switch (section) {
      case "schedule":
        navigate("/lab-admin");
        break;
      case "enterProctor":
        navigate("/lab-admin/add-proctor");
        break;
      default:
        break;
    }
  };

  // Sample client options - you can expand this list
  const clientOptions = [
    "GeoPacific",
    "City of Vancouver",
    "Metro Vancouver",
    "BC Ministry of Transportation",
    "Private Developer A",
    "Private Developer B",
  ];

  // Load initial contacts
  const loadInitialContacts = async () => {
    try {
      setIsLoadingContacts(true);
      const response = await contactApiService.getAllContacts();
      if (response.data) {
        setAllContacts(response.data);
        setProjectManagerOptions(response.data);
        setSiteContactOptions(response.data);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Filter contacts based on search term
  const filterContacts = (searchTerm: string, contacts: ContactData[]) => {
    if (!searchTerm || searchTerm.length < 2) {
      return contacts;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(lowerSearchTerm) ||
      contact.lastName.toLowerCase().includes(lowerSearchTerm) ||
      contact.email.toLowerCase().includes(lowerSearchTerm) ||
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(lowerSearchTerm)
    );
  };

  // Search contacts function
  const searchContacts = async (searchTerm: string, setOptions: (contacts: ContactData[]) => void) => {
    if (searchTerm.length < 2) {
      // Don't clear options, just return without searching
      return;
    }

    try {
      setIsLoadingContacts(true);
      const response = await contactApiService.searchContacts(searchTerm, 10);
      if (response.data) {
        setOptions(response.data);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
      // Don't clear options on error, keep existing ones
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleProjectManagerChange = (_event: any, newValue: string | ContactData | null) => {
    if (typeof newValue === 'string') {
      setProjectManager(newValue);
    } else if (newValue && typeof newValue === 'object') {
      setProjectManager(`${newValue.firstName} ${newValue.lastName}`);
    } else {
      setProjectManager("");
    }
  };

  const handleProjectManagerInputChange = (_event: any, inputValue: string) => {
    // Filter the existing contacts based on input
    const filteredContacts = filterContacts(inputValue, allContacts);
    setProjectManagerOptions(filteredContacts);
    
    // Also do API search for more comprehensive results
    if (inputValue.length >= 2) {
      searchContacts(inputValue, setProjectManagerOptions);
    }
  };

  const handleClientChange = (_event: any, newValue: string | null) => {
    setClient(newValue || "");
  };

  const handleClientInputChange = (_event: any, inputValue: string) => {
    setClient(inputValue);
  };

  const handleSiteContactChange = (_event: any, newValue: string | ContactData | null) => {
    if (typeof newValue === 'string') {
      setSiteContact(newValue);
    } else if (newValue && typeof newValue === 'object') {
      setSiteContact(`${newValue.firstName} ${newValue.lastName}`);
    } else {
      setSiteContact("");
    }
  };

  const handleSiteContactInputChange = (_event: any, inputValue: string) => {
    // Filter the existing contacts based on input
    const filteredContacts = filterContacts(inputValue, allContacts);
    setSiteContactOptions(filteredContacts);
    
    // Also do API search for more comprehensive results
    if (inputValue.length >= 2) {
      searchContacts(inputValue, setSiteContactOptions);
    }
  };

  const handleAddProjectManagerContact = () => {
    setProjectManagerContactDialogOpen(true);
  };

  const handleAddSiteContact = () => {
    setSiteContactDialogOpen(true);
  };

  const handleProjectManagerContactSave = (contact: ContactData) => {
    const contactName = `${contact.firstName} ${contact.lastName}`;
    setProjectManager(contactName);
    setProjectManagerContactDialogOpen(false);
    // Add the new contact to all contacts and options
    setAllContacts(prev => [contact, ...prev]);
    setProjectManagerOptions(prev => [contact, ...prev]);
    console.log("Project Manager contact saved:", contact);
  };

  const handleSiteContactSave = (contact: ContactData) => {
    const contactName = `${contact.firstName} ${contact.lastName}`;
    setSiteContact(contactName);
    setSiteContactDialogOpen(false);
    // Add the new contact to all contacts and options
    setAllContacts(prev => [contact, ...prev]);
    setSiteContactOptions(prev => [contact, ...prev]);
    console.log("Site contact saved:", contact);
  };

  const handleSaveJob = async () => {
    // Validate required fields
    if (!jobNumber.trim()) {
      setSaveError("Job Number is required");
      return;
    }
    if (!projectName.trim()) {
      setSaveError("Project Name is required");
      return;
    }
    if (!client.trim()) {
      setSaveError("Client is required");
      return;
    }
    if (!siteAddress.trim()) {
      setSaveError("Site Address is required");
      return;
    }

    try {
      setIsSavingJob(true);
      setSaveError(null);

      // Transform form data to JobCreateDTO format
      const jobData: JobCreateDTO = {
        jobNumber: jobNumber.trim(),
        clientName: client.trim(),
        projectName: projectName.trim(),
        siteAddress: siteAddress.trim(),
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: undefined, // No end date for new jobs
      };

      console.log("Saving job with data:", jobData);

      // Make API call to create job
      const response = await jobsAPIService.createJob(jobData);
      
      if (response.data) {
        console.log("Job created successfully:", response.data);
        alert(`Job "${jobData.jobNumber}" saved successfully!`);
        
        // Reset form
        setJobNumber("");
        setProjectManager("");
        setSiteContact("");
        setClient("");
        setProjectName("");
        setSiteAddress("");
        setJobNotes("");
        setStartDate("");
        setContacts([]);
      } else {
        throw new Error("No data returned from server");
      }
    } catch (error: any) {
      console.error("Error saving job:", error);
      
      // Handle different types of errors
      if (error.status === 400) {
        // Bad request - validation errors
        if (error.details?.errors) {
          const errorMessages = Object.values(error.details.errors).flat();
          setSaveError(`Validation errors: ${errorMessages.join(", ")}`);
        } else if (error.details?.message) {
          setSaveError(error.details.message);
        } else {
          setSaveError("Please check all required fields and try again.");
        }
      } else if (error.status === 409) {
        // Conflict - job number already exists
        setSaveError("A job with this number already exists. Please use a different job number.");
      } else {
        setSaveError(error.message || "Failed to save job. Please try again.");
      }
    } finally {
      setIsSavingJob(false);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header Bar */}
      <Box
        sx={{
          height: 64,
          backgroundColor: "primary.main",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Title Section */}
        <Box
          sx={{
            backgroundColor: "primary.dark",
            height: "100%",
            display: "flex",
            alignItems: "center",
            px: 3,
            minWidth: 200,
          }}
        >
          {/* Avatar Circle */}
          <Avatar
            sx={{
              bgcolor: "white",
              color: "primary.main",
              fontWeight: "bold",
              fontSize: "1.2rem",
              width: 40,
              height: 40,
              mr: 2,
            }}
          >
            LA
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            Lab Admin
          </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Left Sidebar */}
        <Box
          sx={{
            width: 200,
            backgroundColor: "grey.100",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
          }}
        >
          <Stack spacing={2} sx={{ width: "90%" }}>
            {/* Schedule Button */}
            <Button
              variant="contained"
              onClick={() => handleNavigation("schedule")}
              sx={{
                backgroundColor: "white",
                color: "text.primary",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "grey.50",
                },
              }}
              startIcon={<ScheduleIcon />}
            >
              Schedule
            </Button>

            {/* Create Job Button - Active State */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              startIcon={<AddIcon />}
            >
              Create Job
            </Button>

            {/* Enter Proctor Button */}
            <Button
              variant="contained"
              onClick={() => handleNavigation("enterProctor")}
              sx={{
                backgroundColor: "white",
                color: "text.primary",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "grey.50",
                },
              }}
              startIcon={<PersonIcon />}
            >
              Enter Proctor
            </Button>
          </Stack>
        </Box>

        {/* Main Content Area - Job Details Form */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "background.default",
            p: 4,
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Job Details
          </Typography>

          <Box sx={{ maxWidth: 600 }}>
            {/* Job Number */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Job Number
              </Typography>
              <TextField
                fullWidth
                value={jobNumber}
                onChange={(e) => setJobNumber(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            {/* Project Manager */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Project Manager
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Autocomplete
                  value={projectManager}
                  onChange={handleProjectManagerChange}
                  onInputChange={handleProjectManagerInputChange}
                  options={projectManagerOptions}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return `${option.firstName} ${option.lastName}`;
                  }}
                  isOptionEqualToValue={(option, value) => {
                    if (typeof option === 'string' && typeof value === 'string') {
                      return option === value;
                    }
                    if (typeof option === 'object' && typeof value === 'object') {
                      return option.id === value.id;
                    }
                    return false;
                  }}
                  freeSolo
                  loading={isLoadingContacts}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Type to search contacts..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                      <li key={key} {...otherProps}>
                        {typeof option === 'object' ? (
                          <Box>
                            <Typography variant="body2">
                              {option.firstName} {option.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.email} • {option.personType}
                            </Typography>
                          </Box>
                        ) : (
                          option
                        )}
                      </li>
                    );
                  }}
                  sx={{
                    flex: 1,
                    "& .MuiAutocomplete-popupIndicator": {
                      color: "#666",
                    },
                  }}
                />
                <IconButton
                  onClick={handleAddProjectManagerContact}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    width: 40,
                    height: 40,
                  }}
                >
                  <PersonAddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Site Contact */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Site Contact
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Autocomplete
                  value={siteContact}
                  onChange={handleSiteContactChange}
                  onInputChange={handleSiteContactInputChange}
                  options={siteContactOptions}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return `${option.firstName} ${option.lastName}`;
                  }}
                  isOptionEqualToValue={(option, value) => {
                    if (typeof option === 'string' && typeof value === 'string') {
                      return option === value;
                    }
                    if (typeof option === 'object' && typeof value === 'object') {
                      return option.id === value.id;
                    }
                    return false;
                  }}
                  freeSolo
                  loading={isLoadingContacts}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Type to search contacts..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                      <li key={key} {...otherProps}>
                        {typeof option === 'object' ? (
                          <Box>
                            <Typography variant="body2">
                              {option.firstName} {option.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.email} • {option.personType}
                            </Typography>
                          </Box>
                        ) : (
                          option
                        )}
                      </li>
                    );
                  }}
                  sx={{
                    flex: 1,
                    "& .MuiAutocomplete-popupIndicator": {
                      color: "#666",
                    },
                  }}
                />
                <IconButton
                  onClick={handleAddSiteContact}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    width: 40,
                    height: 40,
                  }}
                >
                  <PersonAddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Client */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Client
              </Typography>
              <Autocomplete
                value={client}
                onChange={handleClientChange}
                onInputChange={handleClientInputChange}
                options={clientOptions}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiAutocomplete-popupIndicator": {
                    color: "#666",
                  },
                }}
              />
            </Box>

            {/* Project Name */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Project Name
              </Typography>
              <TextField
                fullWidth
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            {/* Site Address */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Site Address
              </Typography>
              <TextField
                fullWidth
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            {/* Job Notes */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Job Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={jobNotes}
                onChange={(e) => setJobNotes(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            {/* Start Date */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Start Date
              </Typography>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            {/* Error Display */}
            {saveError && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="error" sx={{ 
                  backgroundColor: "error.light", 
                  p: 1, 
                  borderRadius: 1,
                  textAlign: "center"
                }}>
                  {saveError}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setContactManagerOpen(true)}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                Edit Distribution List
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSaveJob}
                disabled={isSavingJob}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "&:disabled": {
                    backgroundColor: "grey.400",
                    color: "grey.600",
                  },
                }}
              >
                {isSavingJob ? "Saving..." : "Save Job"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Project Manager Contact Form Dialog */}
      <ContactForm
        open={projectManagerContactDialogOpen}
        onClose={() => setProjectManagerContactDialogOpen(false)}
        onSave={handleProjectManagerContactSave}
        title="Add Project Manager Contact"
        mode="dialog"
      />

      {/* Site Contact Form Dialog */}
      <ContactForm
        open={siteContactDialogOpen}
        onClose={() => setSiteContactDialogOpen(false)}
        onSave={handleSiteContactSave}
        title="Add Site Contact"
        mode="dialog"
      />

      {/* Distribution List Manager */}
      <DistributionListManager
        open={contactManagerOpen}
        onClose={() => setContactManagerOpen(false)}
        contacts={contacts}
        onContactsChange={setContacts}
        title="Distribution List Manager"
        jobNumber={jobNumber || "New Job"}
        mode="dialog"
      />
    </Box>
  );
};

export default LabAdminCreateJob;
