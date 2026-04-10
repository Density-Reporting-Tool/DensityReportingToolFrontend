/**
 * PersonFormDialog — reusable add/edit dialog for GeoPacific employees and contractors.
 *
 * Usage (people management):
 *   <PersonFormDialog open={open} onClose={...} onSaved={...} />
 *
 * Usage (job form — project manager):
 *   <PersonFormDialog open={open} onClose={...} onSaved={...}
 *     defaultKind="employee" lockKind title="Add Project Manager" />
 *
 * Usage (job form — site contact):
 *   <PersonFormDialog open={open} onClose={...} onSaved={...}
 *     defaultKind="contractor" lockKind title="Add Site Contact" />
 */

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { personApi } from "@/services/api/personApiService";
import {
  PersonReadDTO,
  EmployeeReadDTO,
  ContractorReadDTO,
  EmployeeCreateDTO,
  EmployeeUpdateDTO,
  ContractorCreateDTO,
  ContractorUpdateDTO,
  RoleDTO,
} from "@/dtos/People/personalInfo";

export type PersonKind = "employee" | "contractor";

export interface PersonFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: (person: PersonReadDTO) => void;
  /** Provide to open in edit mode */
  editPerson?: PersonReadDTO | null;
  /** Pre-select a kind when adding (default: "employee") */
  defaultKind?: PersonKind;
  /** Hide the employee/contractor toggle — useful when type is implied by context */
  lockKind?: boolean;
  /** Override the dialog title */
  title?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const toPersonReadDTO = (
  src: EmployeeReadDTO | ContractorReadDTO,
  roles: RoleDTO[],
): PersonReadDTO => {
  if ("roleId" in src) {
    const roleTitle =
      roles.find((r) => r.id === src.roleId)?.roleTitle ?? src.roleTitle;
    return {
      id: src.id,
      firstName: src.firstName,
      lastName: src.lastName,
      email: src.email,
      phoneNumber: src.phoneNumber,
      company: null,
      personType: "GeoPacific Employee",
      role: roleTitle,
    };
  }
  return {
    id: src.id,
    firstName: src.firstName,
    lastName: src.lastName,
    email: src.email,
    phoneNumber: src.phoneNumber,
    company: src.company,
    personType: "Contact",
    role: null,
  };
};

interface EmpForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number | "";
  password: string;
}

interface ContrForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
}

const emptyEmpForm = (): EmpForm => ({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  roleId: "",
  password: "",
});

const emptyContrForm = (): ContrForm => ({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  company: "",
});

const fieldSx = {
  "& .MuiOutlinedInput-root": { backgroundColor: "white", borderRadius: 1 },
};

// ── Component ─────────────────────────────────────────────────────────────────

const PersonFormDialog: React.FC<PersonFormDialogProps> = ({
  open,
  onClose,
  onSaved,
  editPerson,
  defaultKind = "employee",
  lockKind = false,
  title,
}) => {
  const isEdit = !!editPerson;

  const resolvedKind = (p: PersonReadDTO | null | undefined): PersonKind =>
    p?.personType === "GeoPacific Employee" ? "employee" : "contractor";

  const [kind, setKind] = useState<PersonKind>(
    isEdit ? resolvedKind(editPerson) : defaultKind,
  );

  const [empForm, setEmpForm] = useState<EmpForm>(emptyEmpForm());
  const [contrForm, setContrForm] = useState<ContrForm>(emptyContrForm());

  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (!open) return;
    setError(null);
    if (!isEdit) {
      setKind(defaultKind);
      setEmpForm(emptyEmpForm());
      setContrForm(emptyContrForm());
    } else {
      setKind(resolvedKind(editPerson));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load roles whenever employee form is active
  useEffect(() => {
    if (!open || kind !== "employee") return;
    if (roles.length > 0) return;
    personApi.getRoles().then(setRoles);
  }, [open, kind]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load full details when editing
  useEffect(() => {
    if (!open || !editPerson) return;
    const k = resolvedKind(editPerson);

    const fetchDetails = async () => {
      setLoadingDetails(true);
      setError(null);
      try {
        if (k === "employee") {
          const res = await personApi.getEmployee(editPerson.id);
          const body = res.data;
          const empData = body?.data;
          if (body?.success && empData) {
            setEmpForm({
              firstName: empData.firstName,
              lastName: empData.lastName,
              email: empData.email,
              phoneNumber: empData.phoneNumber,
              roleId: empData.roleId,
              password: "",
            });
          } else {
            setError(body?.message || "Failed to load employee details.");
          }
        } else {
          const res = await personApi.getContractor(editPerson.id);
          const body = res.data;
          const contrData = body?.data;
          if (body?.success && contrData) {
            setContrForm({
              firstName: contrData.firstName,
              lastName: contrData.lastName,
              email: contrData.email,
              phoneNumber: contrData.phoneNumber,
              company: contrData.company,
            });
          } else {
            setError(body?.message || "Failed to load contact details.");
          }
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load person details.");
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [open, editPerson]); // eslint-disable-line react-hooks/exhaustive-deps

  const setEmp = (field: keyof EmpForm, value: string | number | "") =>
    setEmpForm((prev) => ({ ...prev, [field]: value }));

  const setContr = (field: keyof ContrForm, value: string) =>
    setContrForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): string[] => {
    const errors: string[] = [];
    const base = kind === "employee" ? empForm : contrForm;
    if (!base.firstName.trim()) errors.push("First name is required");
    if (!base.lastName.trim()) errors.push("Last name is required");
    if (!base.email.trim()) errors.push("Email is required");
    if (!base.phoneNumber.trim()) errors.push("Phone number is required");
    if (kind === "employee") {
      if (!empForm.roleId) errors.push("Role is required");
      if (!isEdit && !empForm.password) errors.push("Password is required");
      if (empForm.password && empForm.password.length < 6)
        errors.push("Password must be at least 6 characters");
    } else {
      if (!contrForm.company.trim()) errors.push("Company is required");
    }
    return errors;
  };

  const handleSave = async () => {
    setError(null);
    const errs = validate();
    if (errs.length > 0) {
      setError(errs.join(" · "));
      return;
    }

    try {
      setSaving(true);
      let result: PersonReadDTO;

      if (kind === "employee") {
        if (isEdit) {
          const dto: EmployeeUpdateDTO = {
            id: editPerson!.id,
            firstName: empForm.firstName,
            lastName: empForm.lastName,
            email: empForm.email,
            phoneNumber: empForm.phoneNumber,
            roleId: Number(empForm.roleId),
            password: empForm.password || null,
          };
          const res = await personApi.updateEmployee(editPerson!.id, dto);
          const body = res.data;
          const saved = body?.data;
          if (!body?.success || !saved) {
            const detail = body?.errors?.length ? ` — ${body.errors.join(", ")}` : "";
            throw new Error((body?.message || "Update failed") + detail);
          }
          result = toPersonReadDTO(saved, roles);
        } else {
          const dto: EmployeeCreateDTO = {
            firstName: empForm.firstName,
            lastName: empForm.lastName,
            email: empForm.email,
            phoneNumber: empForm.phoneNumber,
            roleId: Number(empForm.roleId),
            password: empForm.password,
          };
          const res = await personApi.createEmployee(dto);
          const body = res.data;
          const saved = body?.data;
          if (!body?.success || !saved) {
            const detail = body?.errors?.length ? ` — ${body.errors.join(", ")}` : "";
            throw new Error((body?.message || "Create failed") + detail);
          }
          result = toPersonReadDTO(saved, roles);
        }
      } else {
        if (isEdit) {
          const dto: ContractorUpdateDTO = {
            id: editPerson!.id,
            ...contrForm,
          };
          const res = await personApi.updateContractor(editPerson!.id, dto);
          const body = res.data;
          const saved = body?.data;
          if (!body?.success || !saved) {
            const detail = body?.errors?.length ? ` — ${body.errors.join(", ")}` : "";
            throw new Error((body?.message || "Update failed") + detail);
          }
          result = toPersonReadDTO(saved, []);
        } else {
          const dto: ContractorCreateDTO = { ...contrForm };
          const res = await personApi.createContractor(dto);
          const body = res.data;
          const saved = body?.data;
          if (!body?.success || !saved) {
            const detail = body?.errors?.length ? ` — ${body.errors.join(", ")}` : "";
            throw new Error((body?.message || "Create failed") + detail);
          }
          result = toPersonReadDTO(saved, []);
        }
      }

      onSaved(result);
    } catch (err: any) {
      setError(err?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const dialogTitle =
    title ??
    (isEdit
      ? `Edit ${editPerson?.firstName} ${editPerson?.lastName}`
      : "Add Person");

  const commonFields = (
    form: EmpForm | ContrForm,
    setFn: (f: any, v: string) => void,
  ) => (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          label="First Name *"
          size="small"
          fullWidth
          value={form.firstName}
          onChange={(e) => setFn("firstName", e.target.value)}
          sx={fieldSx}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Last Name *"
          size="small"
          fullWidth
          value={form.lastName}
          onChange={(e) => setFn("lastName", e.target.value)}
          sx={fieldSx}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Email *"
          size="small"
          fullWidth
          type="email"
          value={form.email}
          onChange={(e) => setFn("email", e.target.value)}
          sx={fieldSx}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Phone Number *"
          size="small"
          fullWidth
          value={form.phoneNumber}
          onChange={(e) => setFn("phoneNumber", e.target.value)}
          sx={fieldSx}
        />
      </Grid>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography variant="h6">{dialogTitle}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Kind selector */}
        {!lockKind && !isEdit && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 0.75 }}
            >
              Person type
            </Typography>
            <ToggleButtonGroup
              value={kind}
              exclusive
              onChange={(_, val) => val && setKind(val as PersonKind)}
              size="small"
            >
              <ToggleButton value="employee">GeoPacific Employee</ToggleButton>
              <ToggleButton value="contractor">External Contact</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {isEdit && (
          <Box
            sx={{
              mb: 2,
              px: 1.5,
              py: 1,
              borderRadius: 1,
              backgroundColor: "grey.50",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {kind === "employee" ? "GeoPacific Employee" : "External Contact"}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loadingDetails ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {kind === "employee" ? (
              <>
                {commonFields(empForm, setEmp)}

                <Grid item xs={12} sm={6}>
                  {roles.length > 0 ? (
                    <>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 0.5 }}
                      >
                        Role *
                      </Typography>
                      <Select
                        value={empForm.roleId}
                        onChange={(e) => setEmp("roleId", Number(e.target.value))}
                        displayEmpty
                        size="small"
                        fullWidth
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                      >
                        <MenuItem value="" disabled>
                          Select a role
                        </MenuItem>
                        {roles.map((r) => (
                          <MenuItem key={r.id} value={r.id}>
                            {r.roleTitle}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <TextField
                      label="Role ID *"
                      size="small"
                      fullWidth
                      type="number"
                      value={empForm.roleId}
                      onChange={(e) =>
                        setEmp("roleId", parseInt(e.target.value) || "")
                      }
                      helperText="Enter role ID (roles list unavailable)"
                      sx={fieldSx}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label={
                      isEdit ? "New Password (leave blank to keep)" : "Password *"
                    }
                    size="small"
                    fullWidth
                    type="password"
                    value={empForm.password}
                    onChange={(e) => setEmp("password", e.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
              </>
            ) : (
              <>
                {commonFields(contrForm, setContr)}

                <Grid item xs={12}>
                  <Divider sx={{ my: 0.5 }} />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Company *"
                    size="small"
                    fullWidth
                    value={contrForm.company}
                    onChange={(e) => setContr("company", e.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
              </>
            )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || loadingDetails}
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Person"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonFormDialog;
