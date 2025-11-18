import { FormEvent, useEffect, useMemo, useState } from "react";
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
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  DeleteOutline as DeleteOutlineIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import HeaderTitle from "@/components/headers/HeaderTitle";
import ContactEditDialog from "@/components/ContactEditDialog";
import { jobsAPIService } from "@/services/apiService";
import { JobReadDTO } from "@/dtos/Job/job";
import { JobProjectManagerReadDTO } from "@/dtos/Job/jobProjectManager";
import { JobSiteContactReadDTO } from "@/dtos/Job/jobSiteContact";
import { JobNoteReadDTO } from "@/dtos/Job/jobNote";

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

const formatDateTime = (isoDate?: string | null) => {
  if (!isoDate) {
    return "";
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState<JobReadDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState<string>("");
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [deletingNoteIds, setDeletingNoteIds] = useState<number[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<{
    type: "project-manager" | "site-contact";
    contact: JobProjectManagerReadDTO | JobSiteContactReadDTO | null;
  } | null>(null);

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

  const jobNotes = useMemo<JobNoteReadDTO[]>(() => {
    if (!jobData?.jobNotes?.length) {
      return [];
    }

    const normalizedNotes = jobData.jobNotes
      .filter((note): note is JobNoteReadDTO => Boolean(note))
      .map((note) => {
        const noteText =
          (note as JobNoteReadDTO).note ??
          ((note as unknown as { Note?: string }).Note ?? "");
        const created =
          note.createdDate ??
          ((note as unknown as { CreatedDate?: string }).CreatedDate ?? "");

        return {
          ...note,
          note: typeof noteText === "string" ? noteText : String(noteText ?? ""),
          createdDate:
            typeof created === "string" ? created : String(created ?? ""),
        };
      })
      .filter((note) => Boolean(note.note && note.note.trim()));

    return normalizedNotes.sort(
      (a, b) =>
        new Date(b.createdDate ?? 0).getTime() -
        new Date(a.createdDate ?? 0).getTime(),
    );
  }, [jobData?.jobNotes]);

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

  const handleAddNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!jobId || !newNote.trim() || isAddingNote) {
      return;
    }

    setIsAddingNote(true);
    setNotesError(null);

    try {
      const response = await jobsAPIService.addJobNote(jobId, newNote.trim());
      const createdNote = response.data;

      setJobData((previous) =>
        previous
          ? {
              ...previous,
              jobNotes: [...(previous.jobNotes ?? []), createdNote],
            }
          : previous,
      );
      setNewNote("");
    } catch (err) {
      console.error("Failed to add job note", err);
      setNotesError("Failed to add note. Please try again.");
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId?: number) => {
    if (!jobId || !noteId || deletingNoteIds.includes(noteId)) {
      return;
    }

    setDeletingNoteIds((previous) => [...previous, noteId]);
    setNotesError(null);

    try {
      await jobsAPIService.deleteJobNote(jobId, noteId);
      setJobData((previous) =>
        previous
          ? {
              ...previous,
              jobNotes: (previous.jobNotes ?? []).filter(
                (note) => note?.id !== noteId,
              ),
            }
          : previous,
      );
    } catch (err) {
      console.error("Failed to delete job note", err);
      setNotesError("Failed to delete note. Please try again.");
    } finally {
      setDeletingNoteIds((previous) =>
        previous.filter((id) => id !== noteId),
      );
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
    if (!jobData?.siteAddress) {
      return;
    }

    const encodedAddress = encodeURIComponent(jobData.siteAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleEditContact = (
    type: "project-manager" | "site-contact",
    contact: JobProjectManagerReadDTO | JobSiteContactReadDTO | null,
  ) => {
    setEditingContact({ type, contact });
    setEditDialogOpen(true);
  };

  const handleContactSaved = async () => {
    // Reload job data to get updated contacts
    if (!jobId) return;

    try {
      const response = await jobsAPIService.getJob(jobId);
      setJobData(response.data);
    } catch (err) {
      console.error("Failed to reload job data", err);
    }
  };

  const getContactForEdit = (
    contactId: string,
  ): JobProjectManagerReadDTO | JobSiteContactReadDTO | null => {
    if (!jobData) return null;

    if (contactId.startsWith("pm-")) {
      const pmId = parseInt(contactId.replace("pm-", ""));
      return (
        (jobData.projectManagers as JobProjectManagerReadDTO[] | undefined)?.find(
          (pm) => pm.id === pmId,
        ) || null
      );
    } else if (contactId.startsWith("sc-")) {
      const scId = parseInt(contactId.replace("sc-", ""));
      return (
        (jobData.siteContacts as JobSiteContactReadDTO[] | undefined)?.find(
          (sc) => sc.id === scId,
        ) || null
      );
    }

    return null;
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
                gap: 2,
              }}
            >
              {contacts.map((contact) => {
                // Check if this is a placeholder contact
                const isPlaceholder =
                  contact.id === "pm-placeholder" ||
                  contact.id === "sc-placeholder" ||
                  contact.isPlaceholder === true;
                
                const contactType = contact.id.startsWith("pm-")
                  ? "project-manager"
                  : "site-contact";
                
                // Get the contact data for editing (only if not a placeholder)
                const contactForEdit = isPlaceholder
                  ? null
                  : getContactForEdit(contact.id);

                return (
                  <Box
                    key={contact.id}
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      flex: 1,
                      maxWidth: "300px",
                      position: "relative",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 45,
                        height: 45,
                        bgcolor: isPlaceholder
                          ? "grey.300"
                          : "primary.main",
                      }}
                    >
                      {contact.initials}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {contact.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contact.role}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        // Allow editing even for placeholders (to add new contact)
                        handleEditContact(
                          contactType as "project-manager" | "site-contact",
                          contactForEdit, // Will be null for placeholders, which is fine for creating
                        );
                      }}
                      sx={{
                        ml: 1,
                        position: "relative",
                        zIndex: 10,
                        opacity: isPlaceholder ? 0.6 : 1,
                      }}
                      aria-label={
                        isPlaceholder
                          ? `Add ${contact.role}`
                          : `Edit ${contact.role}`
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
            {/* Notes Section */}
            <Box sx={{ mb: 3 }}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">Notes</Typography>

                {jobNotes.map((note, index) => (
                  <Box
                    key={note.id ?? `note-${index}`}
                    sx={{ mb: index < jobNotes.length - 1 ? 2 : 0 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ flex: 1, wordBreak: "break-word", mr: 2 }}
                      >
                        {note.note}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineIcon fontSize="small" />}
                        onClick={() => handleDeleteNote(note.id)}
                        disabled={
                          !note.id || deletingNoteIds.includes(note.id)
                        }
                      >
                        {deletingNoteIds.includes(note.id ?? -1)
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                      {formatDateTime(note.createdDate)}
                    </Typography>
                    {index < jobNotes.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}

                {!jobNotes.length && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    No notes available for this job.
                  </Typography>
                )}

                <Box
                  component="form"
                  onSubmit={handleAddNote}
                  sx={{ mt: 3 }}
                >
                  <TextField
                    value={newNote}
                    onChange={(event) => setNewNote(event.target.value)}
                    placeholder="Add a note..."
                    multiline
                    minRows={3}
                    fullWidth
                    disabled={isAddingNote}
                  />
                  {notesError && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {notesError}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!newNote.trim() || isAddingNote}
                    >
                      {isAddingNote ? "Adding..." : "Add Note"}
                    </Button>
                  </Box>
                </Box>
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

        {/* Edit Contact Dialog */}
        {editingContact && (
          <ContactEditDialog
            open={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setEditingContact(null);
            }}
            jobNumber={jobId || ""}
            jobId={jobData?.id || 0}
            type={editingContact.type}
            contact={editingContact.contact}
            onSave={handleContactSaved}
          />
        )}
      </Container>
    </>
  );
};

export default JobDetails;
