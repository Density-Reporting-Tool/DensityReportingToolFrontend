import React, { useState } from "react";
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
  Tabs,
  Tab,
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
import { peopleAPIService } from "@/services/apiService";

const LabAdminCreateJob: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [projectManager, setProjectManager] = useState("Jakub Szary");
  const [client, setClient] = useState("GeoPacific");
  const [addPersonDialogOpen, setAddPersonDialogOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({
    clientName: "GeoPacific",
    firstName: "Peter",
    lastName: "Senyk",
    email: "Peter.Senyk@DRT.ca",
    phone: "1-604-329-9559",
  });
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      lastName: "Senyk",
      firstName: "Peter",
      email: "Peter.Senyk@DRT.ca",
      phone: "1-604-329-9559",
      company: "GeoPacific",
    },
  ]);
  const [contactManagerOpen, setContactManagerOpen] = useState(false);
  const [savingPerson, setSavingPerson] = useState(false);
  const [personError, setPersonError] = useState<string | null>(null);

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

  // Sample project manager options
  const projectManagerOptions = [
    "Jakub Szary",
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
  ];

  const handleProjectManagerChange = (_event: any, newValue: string | null) => {
    setProjectManager(newValue || "");
  };

  const handleClientChange = (_event: any, newValue: string | null) => {
    setClient(newValue || "");
  };

  const handleAddPerson = () => {
    setAddPersonDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAddPersonDialogOpen(false);
    setPersonError(null);
    // Reset form when closing
    setNewPerson({
      clientName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };

  const handleSavePerson = async () => {
    // Validate required fields
    if (!newPerson.firstName || !newPerson.lastName || !newPerson.email || !newPerson.clientName || !newPerson.phone) {
      setPersonError("Please fill in all required fields (First Name, Last Name, Email, Phone Number, and Client Name)");
      return;
    }

    setSavingPerson(true);
    setPersonError(null);

    try {
      const contractorData = {
        firstName: newPerson.firstName,
        lastName: newPerson.lastName,
        email: newPerson.email,
        phoneNumber: newPerson.phone,
        company: newPerson.clientName,
      };

      const response = await peopleAPIService.createContractor(contractorData);
      
      if (response.data) {
        // Success - close dialog and reset form
        setAddPersonDialogOpen(false);
        setNewPerson({
          clientName: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        });
        // Optionally show success message or refresh people list
        // You might want to add a success notification here
      }
    } catch (err: any) {
      console.error("Failed to save person", err);
      setPersonError(err.message || "Failed to save person. Please try again.");
    } finally {
      setSavingPerson(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewPerson((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                },
              }}
            >
              <Tab label="Jobs" />
              <Tab label="Add Contact" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ flex: 1, overflow: "auto", p: 4 }}>
            {activeTab === 0 && (
              <Box>
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
                value="25900"
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
                  options={projectManagerOptions}
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
                Client
              </Typography>
              <Autocomplete
                value={client}
                onChange={handleClientChange}
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
                value="West Parking Lot Improvement"
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
                value="1779 W 75th Ave, Vancouver, BC V6P 3T1"
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
                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis ante ut eros venenatis lacinia ut in nisl. Sed malesuada risus in nisi convallis aliquet. Aliquam convallis scelerisque gravida."
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
                defaultValue="2025-08-15"
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
                Save Job
              </Button>
            </Box>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                  Add Contact
                </Typography>

                <Box sx={{ maxWidth: 600 }}>
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={handleAddPerson}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      mb: 3,
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    Add New Person
                  </Button>

                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    Click the button above to add a new contact to the system.
                  </Typography>
                </Box>
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
                Client Name *
              </Typography>
              <TextField
                fullWidth
                required
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
                Contact First Name *
              </Typography>
              <TextField
                fullWidth
                required
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
                Contact Last Name *
              </Typography>
              <TextField
                fullWidth
                required
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
                Contact Email *
              </Typography>
              <TextField
                fullWidth
                required
                type="email"
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
                Contact Phone Number *
              </Typography>
              <TextField
                fullWidth
                required
                type="tel"
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
          {personError && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: "error.light", borderRadius: 1 }}>
              <Typography variant="body2" color="error.main">
                {personError}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "grey.50", p: 2, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDialog}
            disabled={savingPerson}
            sx={{
              fontWeight: "bold",
              px: 3,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePerson}
            disabled={savingPerson}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              fontWeight: "bold",
              px: 3,
              py: 1,
            }}
          >
            {savingPerson ? "Saving..." : "Save Contact"}
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
        jobNumber="25900"
        mode="dialog"
      />
      </Box>
    </>
  );
};

export default LabAdminCreateJob;
