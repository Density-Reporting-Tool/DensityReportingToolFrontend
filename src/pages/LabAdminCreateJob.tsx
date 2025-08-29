import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from "../components/DistributionListManager";
import { apiService } from "../services/apiService";

const LabAdminCreateJob: React.FC = () => {
  const navigate = useNavigate();
  const [projectManager, setProjectManager] = useState("");
  const [client, setClient] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [jobNotes, setJobNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [addPersonDialogOpen, setAddPersonDialogOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({
    clientName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactManagerOpen, setContactManagerOpen] = useState(false);
  const [clientOptions, setClientOptions] = useState<string[]>([]);
  const [projectManagerOptions, setProjectManagerOptions] = useState<string[]>([]);

  // Form validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch initial data when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch clients and project managers in parallel
        const [clientsResponse, managersResponse] = await Promise.all([
          apiService.getClients(),
          apiService.getProjectManagers()
        ]);

        setClientOptions(clientsResponse.data || []);
        setProjectManagerOptions(managersResponse.data || []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // Don't show error to user for initial data fetch
        // Just log it and continue with empty arrays
      }
    };

    fetchInitialData();
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

  // Client and project manager options will be populated from API or user input

  const handleProjectManagerChange = (_event: any, newValue: string | null) => {
    const newManager = newValue || "";
    setProjectManager(newManager);
    
    // Clear error when user starts typing
    if (errors.projectManager) {
      setErrors(prev => ({ ...prev, projectManager: '' }));
    }
    
    // Add new project manager to options if it doesn't exist
    if (newManager && !projectManagerOptions.includes(newManager)) {
      setProjectManagerOptions(prev => [...prev, newManager]);
    }
  };

  const handleClientChange = (_event: any, newValue: string | null) => {
    const newClient = newValue || "";
    setClient(newClient);
    
    // Clear error when user starts typing
    if (errors.client) {
      setErrors(prev => ({ ...prev, client: '' }));
    }
    
    // Add new client to options if it doesn't exist
    if (newClient && !clientOptions.includes(newClient)) {
      setClientOptions(prev => [...prev, newClient]);
    }
  };

  const handleAddPerson = () => {
    setAddPersonDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAddPersonDialogOpen(false);
  };

  const handleSavePerson = async () => {
    try {
      // Prepare manager data for API
      const managerData = {
        firstName: newPerson.firstName,
        lastName: newPerson.lastName,
        email: newPerson.email,
        phone: newPerson.phone,
        clientName: newPerson.clientName
      };

      // Save to API
      await apiService.createProjectManager(managerData);
      
      // Add the new person to the project manager options
      const newPersonName = `${newPerson.firstName} ${newPerson.lastName}`;
      if (!projectManagerOptions.includes(newPersonName)) {
        setProjectManagerOptions(prev => [...prev, newPersonName]);
      }
      
      setProjectManager(newPersonName);
      setAddPersonDialogOpen(false);
      
      // Clear the form
      setNewPerson({
        clientName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
      
    } catch (error) {
      console.error('Error saving person:', error);
      // You could add error handling here if needed
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewPerson((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validation functions
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'jobNumber':
        return value.trim() === '' ? 'Job Number is required' : '';
      case 'projectName':
        return value.trim() === '' ? 'Project Name is required' : '';
      case 'siteAddress':
        return value.trim() === '' ? 'Site Address is required' : '';
      case 'startDate':
        return value === '' ? 'Start Date is required' : '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: string, value: string, setter: (value: string) => void) => {
    setter(value);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFieldBlur = (field: string, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!jobNumber.trim()) newErrors.jobNumber = "Job number is required";
    if (!projectName.trim()) newErrors.projectName = "Project name is required";
    if (!siteAddress.trim()) newErrors.siteAddress = "Site address is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!client.trim()) newErrors.client = "Client is required";
    if (!projectManager.trim()) newErrors.projectManager = "Project manager is required";
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    setTouched({
      jobNumber: true,
      projectName: true,
      siteAddress: true,
      startDate: true,
      client: true,
      projectManager: true,
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveJob = async () => {
    if (!validateForm()) {
      return; // Don't save if validation fails
    }

    setIsLoading(true);
    setErrors({});
    setSubmitSuccess(false);

    try {
      // Prepare job data for API
      const jobData = {
        jobNumber,
        projectManager,
        client,
        projectName,
        siteAddress,
        jobNotes,
        startDate,
        contacts
      };

      // Make API call to create job
      const response = await apiService.createJob(jobData);
      
      console.log("Job created successfully:", response.data);
      setSubmitSuccess(true);
      
      // Clear the form after successful save
      setJobNumber("");
      setProjectManager("");
      setClient("");
      setProjectName("");
      setSiteAddress("");
      setJobNotes("");
      setStartDate("");
      setContacts([]);
      setErrors({});
      setTouched({});
      
      // Reset success state after a delay
      setTimeout(() => setSubmitSuccess(false), 3000);
      
    } catch (error: any) {
      console.error('Error creating job:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to save job. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('HTTP error! status: 400')) {
          errorMessage = 'Invalid job data. Please check your inputs.';
        } else if (error.message.includes('HTTP error! status: 409')) {
          errorMessage = 'Job number already exists. Please use a different number.';
        } else if (error.message.includes('HTTP error! status: 500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
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
                Job Number <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                required
                value={jobNumber}
                onChange={(e) => handleFieldChange('jobNumber', e.target.value, setJobNumber)}
                onBlur={() => handleFieldBlur('jobNumber', jobNumber)}
                error={touched.jobNumber && !!errors.jobNumber}
                helperText={touched.jobNumber && errors.jobNumber}
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
                Project Manager <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Autocomplete
                  value={projectManager}
                  onChange={handleProjectManagerChange}
                  options={projectManagerOptions}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      size="small"
                      error={touched.projectManager && !!errors.projectManager}
                      helperText={touched.projectManager && errors.projectManager}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                  sx={{
                    flex: 1,
                    "& .MuiAutocomplete-popupIndicator": {
                      color: "#666",
                    },
                  }}
                />
                <IconButton
                  onClick={handleAddPerson}
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
                Client <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Autocomplete
                value={client}
                onChange={handleClientChange}
                options={clientOptions}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    size="small"
                    error={touched.client && !!errors.client}
                    helperText={touched.client && errors.client}
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
                Project Name <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                required
                value={projectName}
                onChange={(e) => handleFieldChange('projectName', e.target.value, setProjectName)}
                onBlur={() => handleFieldBlur('projectName', projectName)}
                error={touched.projectName && !!errors.projectName}
                helperText={touched.projectName && errors.projectName}
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
                Site Address <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                required
                value={siteAddress}
                onChange={(e) => handleFieldChange('siteAddress', e.target.value, setSiteAddress)}
                onBlur={() => handleFieldBlur('siteAddress', siteAddress)}
                error={touched.siteAddress && !!errors.siteAddress}
                helperText={touched.siteAddress && errors.siteAddress}
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
                Start Date <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                type="date"
                required
                variant="outlined"
                size="small"
                value={startDate}
                onChange={(e) => handleFieldChange('startDate', e.target.value, setStartDate)}
                onBlur={() => handleFieldBlur('startDate', startDate)}
                error={touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
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
                disabled={isLoading}
                onClick={handleSaveJob}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: isLoading ? "primary.main" : "primary.dark",
                  },
                  "&:disabled": {
                    backgroundColor: "grey.400",
                    color: "grey.600",
                  },
                }}
              >
                {isLoading ? "Saving..." : "Save Job"}
              </Button>
            </Box>

            {/* Success Message */}
            {submitSuccess && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ color: 'success.contrastText', textAlign: 'center' }}>
                 Job saved successfully!
                </Typography>
              </Box>
            )}

            {/* Submit Error Message */}
            {errors.submit && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'error.light', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ color: 'error.contrastText', textAlign: 'center' }}>
                 {errors.submit}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Add Person Dialog */}
      <Dialog
        open={addPersonDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "grey.50", color: "text.primary" }}>
          Add New Person
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "grey.50", pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Client Name */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Client Name
              </Typography>
              <TextField
                fullWidth
                value={newPerson.clientName}
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
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

            {/* Contact First Name */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Contact First Name
              </Typography>
              <TextField
                fullWidth
                value={newPerson.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
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

            {/* Contact Last Name */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Contact Last Name
              </Typography>
              <TextField
                fullWidth
                value={newPerson.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
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

            {/* Contact Email */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Contact Email
              </Typography>
              <TextField
                fullWidth
                value={newPerson.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
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

            {/* Contact Phone Number */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Contact Phone Number
              </Typography>
              <TextField
                fullWidth
                value={newPerson.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "grey.50", p: 2, gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSavePerson}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              fontWeight: "bold",
              px: 3,
              py: 1,
            }}
          >
            Save Client
          </Button>
          <Button
            variant="contained"
            onClick={handleAddPerson}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              fontWeight: "bold",
              px: 3,
              py: 1,
            }}
          >
            Add Additional Contact
          </Button>
        </DialogActions>
      </Dialog>

      {/* Distribution List Manager */}
      <DistributionListManager
        open={contactManagerOpen}
        onClose={() => setContactManagerOpen(false)}
        contacts={contacts}
        onContactsChange={setContacts}
        title="Distribution List Manager"
        jobNumber=""
        mode="dialog"
      />
    </Box>
  );
};

export default LabAdminCreateJob;
