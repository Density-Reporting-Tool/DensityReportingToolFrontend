import React, { useState } from "react";
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
  Paper,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

export interface Contact {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  company: string;
  isSelected?: boolean;
}

interface DistributionListManagerProps {
  open: boolean;
  onClose: () => void;
  contacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
  title?: string;
  jobNumber?: string;
  mode?: "dialog" | "page";
}

const DistributionListManager: React.FC<DistributionListManagerProps> = ({
  open,
  onClose,
  contacts,
  onContactsChange,
  title = "Distribution List Manager",
  jobNumber,
  mode = "dialog",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addContactDialogOpen, setAddContactDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    company: "",
  });

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddContact = () => {
    setEditingContact(null);
    setNewContact({
      lastName: "",
      firstName: "",
      email: "",
      phone: "",
      company: "",
    });
    setAddContactDialogOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({
      lastName: contact.lastName,
      firstName: contact.firstName,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
    });
    setAddContactDialogOpen(true);
  };

  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId,
    );
    onContactsChange(updatedContacts);
  };

  const handleSaveContact = () => {
    if (editingContact) {
      // Edit existing contact
      const updatedContacts = contacts.map((contact) =>
        contact.id === editingContact.id
          ? { ...contact, ...newContact }
          : contact,
      );
      onContactsChange(updatedContacts);
    } else {
      // Add new contact
      const newContactWithId: Contact = {
        ...newContact,
        id: Date.now().toString(),
        isSelected: false,
      };
      onContactsChange([...contacts, newContactWithId]);
    }
    setAddContactDialogOpen(false);
    setEditingContact(null);
  };

  const handleToggleSelection = (contactId: string) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === contactId
        ? { ...contact, isSelected: !contact.isSelected }
        : contact,
    );
    onContactsChange(updatedContacts);
  };

  const handleSelectAll = () => {
    const allSelected = contacts.every((contact) => contact.isSelected);
    const updatedContacts = contacts.map((contact) => ({
      ...contact,
      isSelected: !allSelected,
    }));
    onContactsChange(updatedContacts);
  };

  const handleDeleteSelected = () => {
    const updatedContacts = contacts.filter((contact) => !contact.isSelected);
    onContactsChange(updatedContacts);
  };

  const selectedCount = contacts.filter((contact) => contact.isSelected).length;

  const content = (
    <Box
      sx={{
        height: mode === "page" ? "100vh" : "auto",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 64,
          backgroundColor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {jobNumber && (
            <Typography
              variant="body1"
              sx={{ color: "white", fontWeight: 500 }}
            >
              Job Number: {jobNumber}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "white", mb: 0.5, fontSize: "0.875rem" }}
            >
              Search
            </Typography>
            <TextField
              size="small"
              placeholder="Enter Name, Email, Phone #"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: 250,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& fieldset": { border: "none" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                ),
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "background.default",
          p: 3,
        }}
      >
        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="contained"
              onClick={handleAddContact}
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: "bold",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Add New Contact
            </Button>

            {selectedCount > 0 && (
              <Button
                variant="outlined"
                onClick={handleDeleteSelected}
                startIcon={<DeleteIcon />}
                sx={{
                  borderColor: "error.main",
                  color: "error.main",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "error.dark",
                    backgroundColor: "error.50",
                  },
                }}
              >
                Delete Selected ({selectedCount})
              </Button>
            )}
          </Box>
        </Box>

        {/* Contacts Table */}
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 2, borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      contacts.length > 0 &&
                      contacts.every((contact) => contact.isSelected)
                    }
                    indeterminate={
                      selectedCount > 0 && selectedCount < contacts.length
                    }
                    onChange={handleSelectAll}
                    sx={{ color: "primary.main" }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  sx={{
                    "&:hover": { backgroundColor: "grey.50" },
                    backgroundColor: contact.isSelected
                      ? "primary.50"
                      : "inherit",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={contact.isSelected || false}
                      onChange={() => handleToggleSelection(contact.id)}
                      sx={{ color: "primary.main" }}
                    />
                  </TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        component="a"
                        href={`mailto:${contact.email}`}
                        sx={{
                          color: "primary.main",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {contact.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={contact.company}
                      size="small"
                      sx={{
                        backgroundColor: "grey.100",
                        color: "text.primary",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditContact(contact)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteContact(contact.id)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
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
      </Box>

      {/* Add/Edit Contact Dialog */}
      <Dialog
        open={addContactDialogOpen}
        onClose={() => setAddContactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PersonIcon />
          {editingContact ? "Edit Contact" : "Add New Contact"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                label="First Name"
                value={newContact.firstName}
                onChange={(e) =>
                  setNewContact((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                fullWidth
                size="small"
                required
              />
              <TextField
                label="Last Name"
                value={newContact.lastName}
                onChange={(e) =>
                  setNewContact((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                fullWidth
                size="small"
                required
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              value={newContact.email}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, email: e.target.value }))
              }
              fullWidth
              size="small"
              required
            />

            <TextField
              label="Phone Number"
              value={newContact.phone}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, phone: e.target.value }))
              }
              fullWidth
              size="small"
              required
            />

            <TextField
              label="Company"
              value={newContact.company}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, company: e.target.value }))
              }
              fullWidth
              size="small"
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setAddContactDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveContact}
            disabled={
              !newContact.firstName || !newContact.lastName || !newContact.email
            }
            sx={{
              backgroundColor: "primary.main",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {editingContact ? "Update Contact" : "Add Contact"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  if (mode === "dialog") {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: "90vh",
            maxHeight: "90vh",
          },
        }}
      >
        {content}
      </Dialog>
    );
  }

  return content;
};

export default DistributionListManager;
