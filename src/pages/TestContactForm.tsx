import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import ContactForm from "@/components/ContactForm";
import { ContactData } from "@/types/contacts";

const TestContactForm: React.FC = () => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [appUserDialogOpen, setAppUserDialogOpen] = useState(false);
  const [savedContact, setSavedContact] = useState<ContactData | null>(null);

  const handleContactSave = (contact: ContactData) => {
    setSavedContact(contact);
    console.log("Contact saved:", contact);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Contact Form Testing
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        Test the different types of contact forms to verify the contact module functionality.
      </Typography>

      {/* Test Buttons */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={() => setContactDialogOpen(true)}
          startIcon={<PersonAddIcon />}
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
          Test Regular Contact Form
        </Button>

        <Button
          variant="contained"
          onClick={() => setEmployeeDialogOpen(true)}
          startIcon={<BusinessIcon />}
          sx={{
            backgroundColor: "secondary.main",
            color: "white",
            fontWeight: "bold",
            py: 1.5,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "secondary.dark",
            },
          }}
        >
          Test GeoPacific Employee Contact Form
        </Button>

        <Button
          variant="contained"
          onClick={() => setAppUserDialogOpen(true)}
          startIcon={<AdminIcon />}
          sx={{
            backgroundColor: "success.main",
            color: "white",
            fontWeight: "bold",
            py: 1.5,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "success.dark",
            },
          }}
        >
          Test GeoPacific App User Form
        </Button>
      </Stack>

      {/* Display Saved Contact */}
      {savedContact && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Last Saved Contact
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">
              <strong>Name:</strong> {savedContact.firstName} {savedContact.lastName}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {savedContact.email}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {savedContact.phoneNumber}
            </Typography>
            {savedContact.company && (
              <Typography variant="body1">
                <strong>Company:</strong> {savedContact.company}
              </Typography>
            )}
            <Typography variant="body1">
              <strong>Type:</strong> {savedContact.personType}
            </Typography>
            {savedContact.role && (
              <Typography variant="body1">
                <strong>Role:</strong> {savedContact.role}
              </Typography>
            )}
            <Typography variant="body1">
              <strong>App User:</strong> {savedContact.isAppUser ? "Yes" : "No"}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Contact Form Dialogs */}
      <ContactForm
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        onSave={handleContactSave}
        contactType="Contact"
        title="Create New Contact"
        mode="dialog"
      />

      <ContactForm
        open={employeeDialogOpen}
        onClose={() => setEmployeeDialogOpen(false)}
        onSave={handleContactSave}
        contactType="GeoPacific Employee"
        title="Create GeoPacific Employee Contact"
        mode="dialog"
      />

      <ContactForm
        open={appUserDialogOpen}
        onClose={() => setAppUserDialogOpen(false)}
        onSave={handleContactSave}
        contactType="GeoPacific App User"
        title="Create GeoPacific App User"
        mode="dialog"
      />
    </Box>
  );
};

export default TestContactForm;
