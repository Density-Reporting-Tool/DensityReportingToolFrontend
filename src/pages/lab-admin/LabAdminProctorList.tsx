import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { proctorApi } from "@/services/api/proctorApiService";
import { ProctorReadDTO, ProctorUpdateDTO } from "@/dtos/Proctor/proctor";

const PROCTOR_TYPES = [
  { id: 1, label: "Standard" },
  { id: 2, label: "Modified" },
];

interface Filters {
  jobNumber: string;
  materialType: string;
  proctorTypeId: number | "";
  labLocation: string;
  dateFrom: string;
  dateTo: string;
}

const emptyFilters = (): Filters => ({
  jobNumber: "",
  materialType: "",
  proctorTypeId: "",
  labLocation: "",
  dateFrom: "",
  dateTo: "",
});

const fieldSx = {
  "& .MuiOutlinedInput-root": { backgroundColor: "white", borderRadius: 1 },
};

// ── Edit dialog ──────────────────────────────────────────────────────────────

interface EditDialogProps {
  proctor: ProctorReadDTO;
  onClose: () => void;
  onSaved: (updated: ProctorReadDTO) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ proctor, onClose, onSaved }) => {
  const [form, setForm] = useState<ProctorUpdateDTO>({
    id: proctor.id,
    proctorID: proctor.proctorID ?? "",
    proctorTestNumber: proctor.proctorTestNumber ?? "",
    labTestId: proctor.labTestId,
    sieveId: proctor.sieveId,
    proctorTypeId: proctor.proctorTypeId,
    materialType: proctor.materialType ?? "",
    labLocation: proctor.labLocation ?? "",
    dateSampled: proctor.dateSampled ? proctor.dateSampled.substring(0, 10) : null,
    dateTested: proctor.dateTested ? proctor.dateTested.substring(0, 10) : null,
    maxDensity: proctor.maxDensity,
    correctedDensity: proctor.correctedDensity,
    optimumMoistureContent: proctor.optimumMoistureContent,
    specificGravity: proctor.specificGravity,
    oversizePercentage: proctor.oversizePercentage,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof ProctorUpdateDTO, value: string | number | null) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!form.proctorID?.trim()) errors.push("Proctor ID is required");
    if (!form.materialType?.trim()) errors.push("Material type is required");
    if (!form.labLocation?.trim()) errors.push("Lab location is required");
    if (!form.proctorTypeId || form.proctorTypeId <= 0)
      errors.push("Proctor type is required");
    if (form.maxDensity != null && (form.maxDensity < 0 || form.maxDensity > 3000))
      errors.push("Max density must be 0–3000");
    if (
      form.correctedDensity != null &&
      (form.correctedDensity < 0 || form.correctedDensity > 3000)
    )
      errors.push("Corrected density must be 0–3000");
    if (
      form.optimumMoistureContent != null &&
      (form.optimumMoistureContent < 0 || form.optimumMoistureContent > 100)
    )
      errors.push("Optimum moisture must be 0–100");
    if (
      form.oversizePercentage != null &&
      (form.oversizePercentage < 0 || form.oversizePercentage > 100)
    )
      errors.push("Oversize percentage must be 0–100");
    if (form.specificGravity != null && (form.specificGravity < 0 || form.specificGravity > 10))
      errors.push("Specific gravity must be 0–10");
    if (form.dateSampled && form.dateTested && new Date(form.dateTested) < new Date(form.dateSampled))
      errors.push("Date tested must be on or after date sampled");
    return errors;
  };

  const handleSave = async () => {
    setError(null);
    const errors = validate();
    if (errors.length > 0) {
      setError(errors.join(" · "));
      return;
    }
    try {
      setSaving(true);
      const updated = await proctorApi.update(proctor.id, form);
      onSaved(updated);
    } catch (err: any) {
      const base = err?.message || "Failed to save changes.";
      const detail = err?.errors?.length ? ` — ${(err.errors as string[]).join(", ")}` : "";
      setError(base + detail);
    } finally {
      setSaving(false);
    }
  };

  const numField = (
    label: string,
    field: keyof ProctorUpdateDTO,
    adornment?: string,
  ) => (
    <TextField
      label={label}
      type="number"
      size="small"
      fullWidth
      value={form[field] ?? ""}
      onChange={(e) =>
        set(field, e.target.value === "" ? null : parseFloat(e.target.value))
      }
      InputProps={
        adornment
          ? { endAdornment: <InputAdornment position="end">{adornment}</InputAdornment> }
          : undefined
      }
      sx={fieldSx}
    />
  );

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6">
            Edit Proctor — {proctor.proctorID}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Job / Lab Test info */}
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 1,
            backgroundColor: "grey.50",
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            Job Association
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">
              <strong>
                Job {proctor.labTest?.job?.jobNumber ?? `#${proctor.labTest?.jobId ?? "—"}`}
              </strong>
              {" · Lab Test ID: "}
              {proctor.labTestId}
            </Typography>
          </Stack>
          <TextField
            label="Lab Test ID *"
            type="number"
            size="small"
            value={form.labTestId}
            onChange={(e) => set("labTestId", parseInt(e.target.value) || form.labTestId)}
            helperText="Change to reassign this proctor to a different lab test"
            sx={{ mt: 1, ...fieldSx }}
          />
        </Box>

        <Grid container spacing={2}>
          {/* Left column */}
          <Grid item xs={12} sm={6}>
            <Stack spacing={2}>
              <TextField
                label="Proctor ID *"
                size="small"
                fullWidth
                value={form.proctorID}
                onChange={(e) => set("proctorID", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Proctor Test #"
                size="small"
                fullWidth
                value={form.proctorTestNumber}
                onChange={(e) => set("proctorTestNumber", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Material Type *"
                size="small"
                fullWidth
                value={form.materialType}
                onChange={(e) => set("materialType", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Lab Location *"
                size="small"
                fullWidth
                value={form.labLocation}
                onChange={(e) => set("labLocation", e.target.value)}
                sx={fieldSx}
              />
              <FormControl size="small" fullWidth>
                <Select
                  value={form.proctorTypeId}
                  onChange={(e: SelectChangeEvent<number>) =>
                    set("proctorTypeId", Number(e.target.value))
                  }
                  displayEmpty
                  sx={{ backgroundColor: "white", borderRadius: 1 }}
                >
                  {PROCTOR_TYPES.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Date Sampled"
                type="date"
                size="small"
                fullWidth
                value={form.dateSampled ?? ""}
                onChange={(e) => set("dateSampled", e.target.value || null)}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
              <TextField
                label="Date Tested"
                type="date"
                size="small"
                fullWidth
                value={form.dateTested ?? ""}
                onChange={(e) => set("dateTested", e.target.value || null)}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Stack>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} sm={6}>
            <Stack spacing={2}>
              {numField("Max Density (kg/m³)", "maxDensity", "kg/m³")}
              {numField("Corrected Density (kg/m³)", "correctedDensity", "kg/m³")}
              {numField("Optimum Moisture Content", "optimumMoistureContent", "%")}
              {numField("Oversize Percentage", "oversizePercentage", "%")}
              {numField("Specific Gravity", "specificGravity")}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ── Proctor row card ─────────────────────────────────────────────────────────

interface ProctorRowProps {
  proctor: ProctorReadDTO;
  onEdit: (p: ProctorReadDTO) => void;
}

const ProctorRow: React.FC<ProctorRowProps> = ({ proctor, onEdit }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      px: 2,
      py: 1.5,
      borderBottom: "1px solid",
      borderColor: "grey.200",
      "&:hover": { backgroundColor: "grey.50" },
    }}
  >
    {/* Main info */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Row 1: Job number + material type */}
      <Stack direction="row" spacing={1.5} alignItems="baseline" flexWrap="wrap">
        <Typography variant="body1" fontWeight={700}>
          Job {proctor.labTest?.job?.jobNumber ?? `#${proctor.labTest?.jobId ?? proctor.labTestId}`}
        </Typography>
        {proctor.materialType && (
          <>
            <Typography variant="body2" color="text.secondary">·</Typography>
            <Typography variant="body1" fontWeight={600}>
              {proctor.materialType}
            </Typography>
          </>
        )}
      </Stack>

      {/* Row 2: Proctor ID + type chip */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
        <Typography variant="body2" color="text.secondary">
          {proctor.proctorID}
        </Typography>
        <Chip
          label={proctor.proctorType?.type ?? `Type ${proctor.proctorTypeId}`}
          size="small"
          color={proctor.proctorType?.id === 2 ? "secondary" : "primary"}
          variant="outlined"
        />
      </Stack>

      {/* Row 3: Secondary details */}
      <Stack direction="row" spacing={2} sx={{ mt: 0.25 }} flexWrap="wrap">
        {proctor.labLocation && (
          <Typography variant="caption" color="text.secondary">
            Lab: {proctor.labLocation}
          </Typography>
        )}
        {proctor.dateTested && (
          <Typography variant="caption" color="text.secondary">
            Tested: {proctor.dateTested.substring(0, 10)}
          </Typography>
        )}
      </Stack>
    </Box>

    {/* Density stats */}
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, mr: 2 }}>
      {proctor.maxDensity != null && (
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Max Density
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {proctor.maxDensity} kg/m³
          </Typography>
        </Box>
      )}
      {proctor.correctedDensity != null && (
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Corrected
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {proctor.correctedDensity} kg/m³
          </Typography>
        </Box>
      )}
      {proctor.optimumMoistureContent != null && (
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Opt. Moisture
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {proctor.optimumMoistureContent}%
          </Typography>
        </Box>
      )}
    </Box>

    {/* Edit button */}
    <Tooltip title="Edit proctor">
      <IconButton
        size="small"
        onClick={() => onEdit(proctor)}
        sx={{ color: "primary.main" }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
);

// ── Main page ────────────────────────────────────────────────────────────────

const LabAdminProctorList: React.FC = () => {
  const navigate = useNavigate();

  const [proctors, setProctors] = useState<ProctorReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters());
  const [editTarget, setEditTarget] = useState<ProctorReadDTO | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let results: ProctorReadDTO[];

      if (filters.jobNumber.trim()) {
        results = await proctorApi.searchByJobNumber(filters.jobNumber.trim(), 100);
      } else {
        const paged = await proctorApi.getAll(1, 200);
        results = paged.items;
      }

      setProctors(results);
    } catch (err: any) {
      setError(err?.message || "Failed to load proctors.");
    } finally {
      setLoading(false);
    }
  }, [filters.jobNumber]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Client-side filters (everything except job number, which hits the backend)
  const filtered = proctors.filter((p) => {
    if (
      filters.materialType &&
      !p.materialType?.toLowerCase().includes(filters.materialType.toLowerCase())
    )
      return false;
    if (filters.proctorTypeId !== "" && p.proctorTypeId !== filters.proctorTypeId)
      return false;
    if (
      filters.labLocation &&
      !p.labLocation?.toLowerCase().includes(filters.labLocation.toLowerCase())
    )
      return false;
    if (filters.dateFrom && p.dateTested && p.dateTested.substring(0, 10) < filters.dateFrom)
      return false;
    if (filters.dateTo && p.dateTested && p.dateTested.substring(0, 10) > filters.dateTo)
      return false;
    return true;
  });

  const activeFilterCount = Object.entries(filters).filter(([, v]) => v !== "" && v !== null).length;

  const setFilter = (field: keyof Filters, value: string | number | "") =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const handleClearFilters = () => setFilters(emptyFilters());

  const handleSaved = (updated: ProctorReadDTO) => {
    setProctors((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditTarget(null);
    setSuccessMessage(`Proctor ${updated.proctorID} updated successfully.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Page header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "grey.200",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          All Proctors
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Toggle filters">
            <Button
              size="small"
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters((v) => !v)}
              sx={{ borderRadius: 2 }}
            >
              Filters
              {activeFilterCount > 0 && (
                <Chip
                  label={activeFilterCount}
                  size="small"
                  color="primary"
                  sx={{ ml: 1, height: 18, fontSize: "0.65rem" }}
                />
              )}
            </Button>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={fetchAll} disabled={loading}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate("/lab-admin/add-proctor")}
            sx={{ borderRadius: 2 }}
          >
            Add Proctor
          </Button>
        </Stack>
      </Box>

      {/* Filter panel */}
      {showFilters && (
        <Box
          sx={{
            px: 3,
            py: 2,
            backgroundColor: "grey.50",
            borderBottom: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Job Number"
                size="small"
                fullWidth
                value={filters.jobNumber}
                onChange={(e) => setFilter("jobNumber", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
                placeholder="e.g. J-001"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Material Type"
                size="small"
                fullWidth
                value={filters.materialType}
                onChange={(e) => setFilter("materialType", e.target.value)}
                sx={fieldSx}
                placeholder="e.g. Riversand"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl size="small" fullWidth>
                <Select
                  value={filters.proctorTypeId}
                  onChange={(e: SelectChangeEvent<number | "">) =>
                    setFilter(
                      "proctorTypeId",
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  displayEmpty
                  sx={{ backgroundColor: "white", borderRadius: 1 }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {PROCTOR_TYPES.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Lab Location"
                size="small"
                fullWidth
                value={filters.labLocation}
                onChange={(e) => setFilter("labLocation", e.target.value)}
                sx={fieldSx}
                placeholder="e.g. Lab A"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={1.5}>
              <TextField
                label="Tested From"
                type="date"
                size="small"
                fullWidth
                value={filters.dateFrom}
                onChange={(e) => setFilter("dateFrom", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={1.5}>
              <TextField
                label="Tested To"
                type="date"
                size="small"
                fullWidth
                value={filters.dateTo}
                onChange={(e) => setFilter("dateTo", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              {activeFilterCount > 0 && (
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  sx={{ color: "text.secondary" }}
                  startIcon={<CloseIcon fontSize="small" />}
                >
                  Clear
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Feedback banners */}
      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage(null)}
          sx={{ mx: 3, mt: 2 }}
        >
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Results count */}
      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {loading ? "Loading..." : `${filtered.length} proctor${filtered.length !== 1 ? "s" : ""} found`}
          {activeFilterCount > 0 && !loading && ` (filtered from ${proctors.length} total)`}
        </Typography>
      </Box>

      <Divider />

      {/* List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", pt: 6 }}>
            <Typography color="text.secondary">
              {activeFilterCount > 0
                ? "No proctors match the current filters."
                : "No proctors found."}
            </Typography>
            {activeFilterCount > 0 && (
              <Button
                size="small"
                onClick={handleClearFilters}
                sx={{ mt: 1 }}
              >
                Clear filters
              </Button>
            )}
          </Box>
        ) : (
          filtered.map((p) => (
            <ProctorRow key={p.id} proctor={p} onEdit={setEditTarget} />
          ))
        )}
      </Box>

      {/* Edit dialog */}
      {editTarget && (
        <EditDialog
          proctor={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
};

export default LabAdminProctorList;
