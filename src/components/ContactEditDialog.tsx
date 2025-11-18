import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { jobsAPIService, peopleAPIService } from "@/services/apiService";
import {
  JobProjectManagerReadDTO,
  JobProjectManagerCreateDTO,
  JobProjectManagerUpdateDTO,
} from "@/dtos/Job/jobProjectManager";
import {
  JobSiteContactReadDTO,
  JobSiteContactCreateDTO,
  JobSiteContactUpdateDTO,
} from "@/dtos/Job/jobSiteContact";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company?: string;
}

interface ContactEditDialogProps {
  open: boolean;
  onClose: () => void;
  jobNumber: string;
  jobId: number;
  type: "project-manager" | "site-contact";
  contact: JobProjectManagerReadDTO | JobSiteContactReadDTO | null;
  onSave: () => void;
}

const ContactEditDialog: React.FC<ContactEditDialogProps> = ({
  open,
  onClose,
  jobNumber,
  jobId,
  type,
  contact,
  onSave,
}) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Site contact specific fields
  const [area, setArea] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (open) {
      loadPeople();
      if (contact) {
        // Populate form with existing contact data
        if (type === "project-manager") {
          const pm = contact as JobProjectManagerReadDTO;
          setSelectedPersonId(pm.personalInfoId);
          setIsPrimary(pm.isPrimary);
          setIsActive(pm.isActive);
          setNotes(pm.notes || "");
          setStartDate(pm.startDate ? new Date(pm.startDate).toISOString().split("T")[0] : "");
          setEndDate(pm.endDate ? new Date(pm.endDate).toISOString().split("T")[0] : "");
        } else {
          const sc = contact as JobSiteContactReadDTO;
          setSelectedPersonId(sc.personalInfoId);
          setIsPrimary(sc.isPrimary);
          setIsActive(sc.isActive);
          setNotes(sc.notes || "");
          setArea(sc.area || "");
          setCompany(sc.company || "");
          setRole(sc.role || "");
        }
      } else {
        // Reset form for new contact
        resetForm();
      }
    }
  }, [open, contact, type]);

  const loadPeople = async () => {
    setLoadingPeople(true);
    try {
      const response = await peopleAPIService.getPeople();
      if (response.data) {
        setPeople(response.data);
      }
    } catch (err) {
      console.error("Failed to load people", err);
      setError("Failed to load people. Please try again.");
    } finally {
      setLoadingPeople(false);
    }
  };

  const resetForm = () => {
    setSelectedPersonId(null);
    setIsPrimary(false);
    setIsActive(true);
    setNotes("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setArea("");
    setCompany("");
    setRole("");
  };

  const handleSave = async () => {
    if (!selectedPersonId) {
      setError("Please select a person");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Debug logging
      console.log("Saving contact:", { type, contact, hasContact: !!contact, contactId: contact?.id });

      if (type === "project-manager") {
        if (contact && contact.id && typeof contact.id === "number" && contact.id > 0) {
          console.log("Updating project manager:", contact.id);
          // Update existing - only if contact has a valid ID
          const pmData: JobProjectManagerUpdateDTO = {
            jobId,
            personalInfoId: selectedPersonId,
            startDate: startDate || new Date().toISOString(),
            endDate: endDate || undefined,
            notes: notes || undefined,
            isPrimary,
            isActive,
          };
          await jobsAPIService.updateProjectManager(
            jobNumber,
            contact.id,
            pmData,
          );
        } else {
          console.log("Creating new project manager");
          // Create new
          const pmData: JobProjectManagerCreateDTO = {
            jobId,
            personalInfoId: selectedPersonId,
            startDate: startDate || new Date().toISOString(),
            endDate: endDate || undefined,
            notes: notes || undefined,
            isPrimary,
            isActive,
          };
          await jobsAPIService.createProjectManager(jobNumber, pmData);
        }
      } else {
        if (contact && contact.id && typeof contact.id === "number" && contact.id > 0) {
          console.log("Updating site contact:", contact.id);
          // Update existing - only if contact has a valid ID
          const scData: JobSiteContactUpdateDTO = {
            jobId,
            personalInfoId: selectedPersonId,
            area: area || undefined,
            company: company || undefined,
            role: role || undefined,
            notes: notes || undefined,
            isPrimary,
            isActive,
          };
          await jobsAPIService.updateSiteContact(
            jobNumber,
            contact.id,
            scData,
          );
        } else {
          console.log("Creating new site contact");
          // Create new
          const scData: JobSiteContactCreateDTO = {
            jobId,
            personalInfoId: selectedPersonId,
            area: area || undefined,
            company: company || undefined,
            role: role || undefined,
            notes: notes || undefined,
            isPrimary,
            isActive,
          };
          await jobsAPIService.createSiteContact(jobNumber, scData);
        }
      }

      onSave();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error("Failed to save contact", err);
      console.log("Error details:", { status: err.status, contact, contactId: contact?.id });
      
      // Handle 404 errors - contact might not exist, try creating instead
      if (err.status === 404) {
        console.log("Contact not found (404), attempting to create new contact instead");
        try {
          if (type === "project-manager") {
            const pmData: JobProjectManagerCreateDTO = {
              jobId,
              personalInfoId: selectedPersonId,
              startDate: startDate || new Date().toISOString(),
              endDate: endDate || undefined,
              notes: notes || undefined,
              isPrimary,
              isActive,
            };
            await jobsAPIService.createProjectManager(jobNumber, pmData);
          } else {
            const scData: JobSiteContactCreateDTO = {
              jobId,
              personalInfoId: selectedPersonId,
              area: area || undefined,
              company: company || undefined,
              role: role || undefined,
              notes: notes || undefined,
              isPrimary,
              isActive,
            };
            await jobsAPIService.createSiteContact(jobNumber, scData);
          }
          onSave();
          onClose();
          resetForm();
          return;
        } catch (createErr: any) {
          setError(createErr.message || "Failed to create contact. Please try again.");
        }
      } else {
        setError(err.message || "Failed to save contact. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const selectedPerson = people.find((p) => p.id === selectedPersonId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <EditIcon />
        {contact
          ? `Edit ${type === "project-manager" ? "Project Manager" : "Site Contact"}`
          : `Add ${type === "project-manager" ? "Project Manager" : "Site Contact"}`}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Person Selection */}
          <Autocomplete
            options={people}
            loading={loadingPeople}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}${option.company ? ` (${option.company})` : ""}`
            }
            value={selectedPerson || null}
            onChange={(_, newValue) =>
              setSelectedPersonId(newValue?.id || null)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Person"
                required
                placeholder="Select a person"
              />
            )}
          />

          {/* Type-specific fields */}
          {type === "project-manager" ? (
            <>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              <TextField
                label="End Date (optional)"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </>
          ) : (
            <>
              <TextField
                label="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g., North Site, Excavation Area"
                fullWidth
              />
              <TextField
                label="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., ABC Excavation"
                fullWidth
              />
              <TextField
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Site Supervisor, Safety Officer"
                fullWidth
              />
            </>
          )}

          {/* Common fields */}
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            placeholder="Additional notes..."
            fullWidth
          />

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                />
              }
              label="Primary"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Active"
            />
          </Box>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!selectedPersonId || saving}
        >
          {saving ? "Saving..." : contact ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactEditDialog;

