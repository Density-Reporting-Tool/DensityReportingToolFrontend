import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import { personApi } from "@/services/api/personApiService";
import { PersonReadDTO } from "@/dtos/People/personalInfo";
import PersonFormDialog from "@/components/people/PersonFormDialog";

type TypeFilter = "" | "GeoPacific Employee" | "Contact";

interface Filters {
  search: string;
  personType: TypeFilter;
}

const emptyFilters = (): Filters => ({ search: "", personType: "" });

const fieldSx = {
  "& .MuiOutlinedInput-root": { backgroundColor: "white", borderRadius: 1 },
};

// ── Person row ────────────────────────────────────────────────────────────────

interface PersonRowProps {
  person: PersonReadDTO;
  onEdit: (p: PersonReadDTO) => void;
}

const PersonRow: React.FC<PersonRowProps> = ({ person, onEdit }) => (
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
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Typography variant="body1" fontWeight={600}>
          {person.firstName} {person.lastName}
        </Typography>
        <Chip
          label={person.personType === "GeoPacific Employee" ? "Employee" : "Contact"}
          size="small"
          color={person.personType === "GeoPacific Employee" ? "primary" : "default"}
          variant="outlined"
        />
        {person.role && (
          <Typography variant="body2" color="text.secondary">
            {person.role}
          </Typography>
        )}
        {person.company && (
          <Typography variant="body2" color="text.secondary">
            {person.company}
          </Typography>
        )}
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
        <Typography variant="caption" color="text.secondary">
          {person.email}
        </Typography>
        {person.phoneNumber && (
          <Typography variant="caption" color="text.secondary">
            {person.phoneNumber}
          </Typography>
        )}
      </Stack>
    </Box>

    <Tooltip title="Edit">
      <IconButton size="small" onClick={() => onEdit(person)} sx={{ color: "primary.main" }}>
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
);

// ── Main page ─────────────────────────────────────────────────────────────────

const LabAdminPeopleList: React.FC = () => {
  const [people, setPeople] = useState<PersonReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters());
  const [showFilters, setShowFilters] = useState(true);
  const [editTarget, setEditTarget] = useState<PersonReadDTO | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await personApi.getAll(1, 200);
      setPeople(items);
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.errors?.[0] ||
        (typeof err === "string" ? err : null) ||
        "Failed to load people.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = (people ?? []).filter((p) => {
    if (filters.personType && p.personType !== filters.personType) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      if (
        !fullName.includes(q) &&
        !p.email.toLowerCase().includes(q) &&
        !(p.company?.toLowerCase().includes(q)) &&
        !(p.role?.toLowerCase().includes(q))
      )
        return false;
    }
    return true;
  });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const setFilter = (field: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSaved = (saved: PersonReadDTO) => {
    setPeople((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      if (exists) return prev.map((p) => (p.id === saved.id ? saved : p));
      return [saved, ...prev];
    });
    if (editTarget) {
      setEditTarget(null);
      showSuccess(`${saved.firstName} ${saved.lastName} updated.`);
    } else {
      setAddOpen(false);
      showSuccess(`${saved.firstName} ${saved.lastName} added.`);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
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
          People
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
            <span>
              <IconButton size="small" onClick={fetchAll} disabled={loading}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Add Person
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
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
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Search"
                size="small"
                fullWidth
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
                placeholder="Name, email, company, role…"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <Select
                  value={filters.personType}
                  onChange={(e: SelectChangeEvent<TypeFilter>) =>
                    setFilter("personType", e.target.value as string)
                  }
                  displayEmpty
                  sx={{ backgroundColor: "white", borderRadius: 1 }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="GeoPacific Employee">Employees</MenuItem>
                  <MenuItem value="Contact">Contacts</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs="auto">
              {activeFilterCount > 0 && (
                <Button
                  size="small"
                  onClick={() => setFilters(emptyFilters())}
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

      {/* Feedback */}
      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mx: 3, mt: 2 }}>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Count */}
      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {loading
            ? "Loading…"
            : `${filtered.length} ${filtered.length !== 1 ? "people" : "person"} found`}
          {activeFilterCount > 0 && !loading && ` (filtered from ${people.length} total)`}
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
              {activeFilterCount > 0 ? "No people match the current filters." : "No people found."}
            </Typography>
            {activeFilterCount > 0 && (
              <Button size="small" onClick={() => setFilters(emptyFilters())} sx={{ mt: 1 }}>
                Clear filters
              </Button>
            )}
          </Box>
        ) : (
          filtered.map((p) => <PersonRow key={p.id} person={p} onEdit={setEditTarget} />)
        )}
      </Box>

      {/* Add dialog */}
      <PersonFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={handleSaved}
      />

      {/* Edit dialog */}
      {editTarget && (
        <PersonFormDialog
          open
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
          editPerson={editTarget}
        />
      )}
    </Box>
  );
};

export default LabAdminPeopleList;
