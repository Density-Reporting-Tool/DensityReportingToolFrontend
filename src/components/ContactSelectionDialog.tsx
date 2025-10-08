import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { ContactData } from "@/types/contacts";
import { contactApiService } from "@/services/contactApiService";

interface ContactSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectContact: (contact: ContactData) => void;
  title: string;
  jobNumber: string;
}

const ContactSelectionDialog: React.FC<ContactSelectionDialogProps> = ({
  open,
  onClose,
  onSelectContact,
  title,
  jobNumber,
}) => {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null);

  // Load contacts when dialog opens
  useEffect(() => {
    if (open) {
      loadContacts();
    }
  }, [open]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactApiService.getAllContacts();
      setContacts(response.data);
    } catch (err) {
      console.error("Error loading contacts:", err);
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.firstName?.toLowerCase().includes(searchLower) ||
      contact.lastName?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.phoneNumber?.includes(searchTerm) ||
      contact.company?.toLowerCase().includes(searchLower)
    );
  });

  const handleSelectContact = () => {
    if (selectedContact) {
      onSelectContact(selectedContact);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedContact(null);
    setSearchTerm("");
    setError(null);
    onClose();
  };

  const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  const getFullName = (contact: ContactData): string => {
    return `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unknown";
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: "90vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              bgcolor: "white",
              color: "primary.main",
              fontWeight: "bold",
              fontSize: "1.2rem",
              width: 40,
              height: 40,
            }}
          >
            LA
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header with search */}
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "grey.50",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Select Contact for Job #{jobNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredContacts.length} contact{filteredContacts.length !== 1 ? "s" : ""} found
            </Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Search contacts by name, email, phone, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 4 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Button variant="outlined" onClick={loadContacts}>
                Retry
              </Button>
            </Box>
          ) : (
            <TableContainer sx={{ height: "100%" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      sx={{
                        "&:hover": { backgroundColor: "grey.50" },
                        backgroundColor: selectedContact?.id === contact.id ? "primary.50" : "inherit",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                            {getInitials(contact.firstName, contact.lastName)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {getFullName(contact)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {contact.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          component="a"
                          href={`mailto:${contact.email}`}
                          sx={{
                            color: "primary.main",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {contact.email || "Not provided"}
                        </Typography>
                      </TableCell>
                      <TableCell>{contact.phoneNumber || "Not provided"}</TableCell>
                      <TableCell>
                        {contact.company ? (
                          <Chip
                            label={contact.company}
                            size="small"
                            sx={{
                              backgroundColor: "grey.100",
                              color: "text.primary",
                            }}
                          />
                        ) : (
                          "Not provided"
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={contact.personType || "Contact"}
                          size="small"
                          color={contact.personType === "GeoPacific Employee" ? "primary" : "default"}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedContact?.id === contact.id}
                          onChange={() => setSelectedContact(contact)}
                          sx={{ color: "primary.main" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredContacts.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {searchTerm
                            ? "No contacts found matching your search."
                            : "No contacts available."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: "1px solid", borderColor: "divider" }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSelectContact}
          variant="contained"
          disabled={!selectedContact}
          startIcon={<AddIcon />}
        >
          Select {selectedContact ? getFullName(selectedContact) : "Contact"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactSelectionDialog;
