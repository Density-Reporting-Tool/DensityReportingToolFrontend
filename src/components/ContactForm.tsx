import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Save as SaveIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { 
  ContactData
} from "@/types/contacts";
import { contactApiService } from "@/services/contactApiService";

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
  onSave?: (contact: ContactData) => void;
  initialData?: ContactData | null;
  title?: string;
  mode?: "dialog" | "page";
}

const ContactForm: React.FC<ContactFormProps> = ({
  open,
  onClose,
  onSave,
  initialData = null,
  title = "Contact Form",
  mode = "dialog"
}) => {
  // Form state management
  const [formData, setFormData] = useState<ContactData>({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
  });
  const [isGeoPacificEmployee, setIsGeoPacificEmployee] = useState(false);

  // UI state management
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Initialize form data when component opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        const company = initialData.company || "";
        setFormData({
          id: initialData.id,
          firstName: initialData.firstName || "",
          lastName: initialData.lastName || "",
          email: initialData.email || "",
          phoneNumber: initialData.phoneNumber || "",
          company: company,
        });
        setIsGeoPacificEmployee(company === "GeoPacific Consultants");
      } else {
        // Reset form to default values
        setFormData({
          id: null,
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          company: "",
        });
        setIsGeoPacificEmployee(false);
      }
      setValidationErrors([]);
      setSuccessMessage("");
    }
  }, [open, initialData]);

  // Form field handlers
  const handleInputChange = (
    field: keyof ContactData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGeoPacificEmployeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsGeoPacificEmployee(checked);
    
    setFormData((prev) => ({
      ...prev,
      company: checked ? "GeoPacific Consultants" : "",
    }));
  };

  // Save contact data
  const handleSaveContact = async () => {
    try {
      setIsLoading(true);
      setValidationErrors([]);
      setSuccessMessage("");

      // Validate form data
      const validation = contactApiService.validateContactData(formData);

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }

      // Save to database
      const response = await contactApiService.createContact(formData);

      console.log("Contact saved successfully!", response.data);
      setSuccessMessage("Contact saved successfully!");
      
      // Call onSave callback if provided
      if (onSave && response.data) {
        // Create a proper ContactData object from the response
        const contactData: ContactData = {
          id: response.data.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          company: formData.company,
        };
        onSave(contactData);
      }

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Error saving contact:", error);
      setValidationErrors(["An error occurred while saving the contact. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form
  const handleClearForm = () => {
    setFormData({
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      company: "",
    });
    setIsGeoPacificEmployee(false);
    setValidationErrors([]);
    setSuccessMessage("");
  };

  // Form content
  const formContent = (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {title}
      </Typography>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* GeoPacific Employee Checkbox */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isGeoPacificEmployee}
              onChange={handleGeoPacificEmployeeChange}
              sx={{
                color: "primary.main",
                "&.Mui-checked": {
                  color: "primary.main",
                },
              }}
            />
          }
          label="GeoPacific Employee"
          sx={{
            "& .MuiFormControlLabel-label": {
              fontWeight: 500,
              color: "text.primary",
            },
          }}
        />
        {isGeoPacificEmployee && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: "block", mt: 1 }}>
            Company will be set to "GeoPacific Consultants"
          </Typography>
        )}
      </Box>

      {/* First Name */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
          First Name *
        </Typography>
        <TextField
          fullWidth
          value={formData.firstName}
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

      {/* Last Name */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
          Last Name *
        </Typography>
        <TextField
          fullWidth
          value={formData.lastName}
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

      {/* Email */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
          Email *
        </Typography>
        <TextField
          fullWidth
          type="email"
          value={formData.email}
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

      {/* Phone Number */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
          Phone Number *
        </Typography>
        <TextField
          fullWidth
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
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

      {/* Company */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
          Company
        </Typography>
        <TextField
          fullWidth
          value={formData.company || ""}
          onChange={(e) => handleInputChange("company", e.target.value)}
          variant="outlined"
          size="small"
          disabled={isGeoPacificEmployee}
          helperText={isGeoPacificEmployee ? "Automatically set to GeoPacific Consultants" : ""}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: isGeoPacificEmployee ? "grey.100" : "white",
              borderRadius: 1,
            },
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "text.primary",
            },
          }}
        />
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSaveContact}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            "&:disabled": {
              backgroundColor: "grey.400",
            },
          }}
        >
          {isLoading ? "Saving..." : "Save Contact"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleClearForm}
          disabled={isLoading}
          startIcon={<ClearIcon />}
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: 2,
            "&:hover": {
              borderColor: "primary.dark",
              color: "primary.dark",
            },
          }}
        >
          Clear Form
        </Button>
      </Stack>
    </Box>
  );

  // Render based on mode
  if (mode === "dialog") {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: "60vh",
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "grey.50", color: "text.primary" }}>
          {title}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "grey.50", pt: 2 }}>
          {formContent}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "grey.50", p: 2 }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              backgroundColor: "grey.600",
              color: "white",
              fontWeight: "bold",
              px: 3,
              py: 1,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Page mode
  return (
    <Box sx={{ p: 4 }}>
      {formContent}
    </Box>
  );
};

export default ContactForm;
