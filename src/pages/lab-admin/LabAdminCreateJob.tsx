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
  Alert,
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
import { jobsAPIService } from "@/services/apiService";

const clientOptions = [
  "GeoPacific",
  "City of Vancouver",
  "Metro Vancouver",
  "BC Ministry of Transportation",
  "Private Developer A",
  "Private Developer B",
];

const projectManagerOptions = [
  "Jakub Szary",
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Wilson",
  "David Brown",
];

const LabAdminCreateJob: React.FC = () => {
  const navigate = useNavigate();

  const [jobNumber, setJobNumber] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [client, setClient] = useState("");
  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [jobNotes, setJobNotes] = useState("");
  const [startDate, setStartDate] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const handleNavigation = (section: string) => {
    switch (section) {
      case "schedule":
        navigate("/lab-admin");
        break;
      case "enterProctor":
        navigate("/lab-admin/add-proctor");
        break;
    }
  };

  const handleProjectManagerChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setProjectManager(newValue || "");
  };

  const handleClientChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setClient(newValue || "");
  };

  const handleAddPerson = () => {
    setAddPersonDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAddPersonDialogOpen(false);
  };

  const handleSavePerson = () => {
    const newPersonName = `${newPerson.firstName} ${newPerson.lastName}`.trim();
    if (newPersonName) setProjectManager(newPersonName);
    setAddPersonDialogOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewPerson((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveJob = async () => {
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);
    try {
      await jobsAPIService.createJob({
        jobNumber,
        clientName: client,
        projectName,
        siteAddress,
        startDate: startDate || null,
        endDate: null,
      });
      setSaveSuccess(true);
    } catch (err) {
      console.error("Error creating job:", err);
      setSaveError("Failed to save job. Please try again.");
    } finally {
      setIsSaving(false);
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
            sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}
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
            <Button
              variant="contained"
              onClick={() => handleNavigation("schedule")}
              sx={{
                backgroundColor: "white",
                color: "text.primary",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": { backgroundColor: "grey.50" },
              }}
              startIcon={<ScheduleIcon />}
            >
              Schedule
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": { backgroundColor: "primary.dark" },
              }}
              startIcon={<AddIcon />}
            >
              Create Job
            </Button>

            <Button
              variant="contained"
              onClick={() => handleNavigation("enterProctor")}
              sx={{
                backgroundColor: "white",
                color: "text.primary",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": { backgroundColor: "grey.50" },
              }}
              startIcon={<PersonIcon />}
            >
              Enter Proctor
            </Button>
          </Stack>
        </Box>

        {/* Main Content Area - Job Details Form */}
        <Box
          sx={{ flex: 1, backgroundColor: "background.default", p: 4 }}
        >
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Job Details
          </Typography>

          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Job created successfully.
            </Alert>
          )}
          {saveError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {saveError}
            </Alert>
          )}

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
                    "& .MuiAutocomplete-popupIndicator": { color: "#666" },
                  }}
                />
                <IconButton
                  onClick={handleAddPerson}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": { backgroundColor: "primary.dark" },
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
                  "& .MuiAutocomplete-popupIndicator": { color: "#666" },
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
                InputLabelProps={{ shrink: true }}
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
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                Edit Distribution List
              </Button>
              <Button
                variant="contained"
                fullWidth
                disabled={isSaving}
                onClick={handleSaveJob}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                {isSaving ? "Saving…" : "Save Job"}
              </Button>
            </Box>
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
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Client Name
              </Typography>
              <TextField
                fullWidth
                value={newPerson.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
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
        jobNumber={jobNumber}
        mode="dialog"
      />
    </Box>
  );
};

export default LabAdminCreateJob;
