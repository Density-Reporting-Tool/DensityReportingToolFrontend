import React, { useCallback, useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, SlotInfo, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { apiService } from "@/services/apiService";
import { ENDPOINTS } from "@/config/endpoints";
import { JobReadDTO } from "@/dtos/Job/job";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { "en-US": enUS },
});

interface ScheduleEvent {
  id: number;
  jobId: number;
  personalInfoId: number;
  startDateTime: string;
  endDateTime: string;
  description?: string;
  status?: string;
  job: { id: number; jobNumber: string; projectName: string; clientName: string };
  personalInfo?: { id: number; firstName: string; lastName: string };
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: ScheduleEvent;
}

interface PersonListFlatDto {
  id: number;
  firstName: string;
  lastName: string;
  personType: string;
}

interface PagedResult<T> {
  items: T[];
  metadata: { currentPage: number; pageSize: number; totalCount: number };
}

interface CreateEventForm {
  jobId: string;
  personalInfoId: string;
  startDateTime: string;
  endDateTime: string;
  description: string;
}

const toLocalDatetimeInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const emptyForm = (start?: Date, end?: Date): CreateEventForm => ({
  jobId: "",
  personalInfoId: "",
  startDateTime: start ? toLocalDatetimeInput(start) : "",
  endDateTime: end ? toLocalDatetimeInput(end) : "",
  description: "",
});

const ScheduleCalendarView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [jobs, setJobs] = useState<JobReadDTO[]>([]);
  const [people, setPeople] = useState<PersonListFlatDto[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [form, setForm] = useState<CreateEventForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fetchEvents = useCallback(async (rangeDate: Date) => {
    setLoading(true);
    try {
      const start = new Date(rangeDate.getFullYear(), rangeDate.getMonth() - 1, 1).toISOString();
      const end = new Date(rangeDate.getFullYear(), rangeDate.getMonth() + 2, 0, 23, 59, 59).toISOString();
      const res = await apiService.get<ScheduleEvent[]>(
        `${ENDPOINTS.SCHEDULING.EVENTS}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      );
      const raw = (res.data as unknown as ScheduleEvent[]) ?? [];
      setEvents(
        raw.map((e) => ({
          id: e.id,
          title: `Job #${e.job.jobNumber}${e.personalInfo ? ` — ${e.personalInfo.firstName} ${e.personalInfo.lastName}` : ""}`,
          start: new Date(e.startDateTime),
          end: new Date(e.endDateTime),
          resource: e,
        }))
      );
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(currentDate);
  }, [currentDate, fetchEvents]);

  useEffect(() => {
    const loadSelectors = async () => {
      const [jobsRes, peopleRes] = await Promise.allSettled([
        apiService.get<PagedResult<JobReadDTO>>(`${ENDPOINTS.JOBS.LIST}?pageNumber=1&pageSize=500`),
        apiService.get<PersonListFlatDto[]>(ENDPOINTS.PEOPLE.LIST),
      ]);
      if (jobsRes.status === "fulfilled") {
        const paged = jobsRes.value.data as unknown as PagedResult<JobReadDTO>;
        setJobs(paged?.items ?? []);
      }
      if (peopleRes.status === "fulfilled") {
        const all = (peopleRes.value.data as unknown as PersonListFlatDto[]) ?? [];
        setPeople(all.filter((p) => p.personType === "GeoPacific Employee"));
      }
    };
    loadSelectors();
  }, []);

  const handleSelectSlot = (slot: SlotInfo) => {
    const start = slot.start;
    // In month view react-big-calendar sets end = midnight of next day; default to 1 hour after start instead
    const diffMs = slot.end.getTime() - slot.start.getTime();
    const end = diffMs >= 24 * 60 * 60 * 1000
      ? new Date(start.getTime() + 60 * 60 * 1000)
      : slot.end;
    setForm(emptyForm(start, end));
    setSaveError("");
    setCreateOpen(true);
  };

  const handleSelectEvent = (ev: CalendarEvent) => {
    setSelectedEvent(ev.resource);
    setDetailOpen(true);
  };

  const handleCreate = async () => {
    if (!form.jobId || !form.personalInfoId || !form.startDateTime || !form.endDateTime) {
      setSaveError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      await apiService.post(ENDPOINTS.SCHEDULING.EVENTS, {
        jobId: Number(form.jobId),
        personalInfoId: Number(form.personalInfoId),
        startDateTime: new Date(form.startDateTime).toISOString(),
        endDateTime: new Date(form.endDateTime).toISOString(),
        description: form.description || undefined,
        status: "Scheduled",
      });
      setCreateOpen(false);
      await fetchEvents(currentDate);
    } catch {
      setSaveError("Failed to create event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Schedule</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setForm(emptyForm()); setSaveError(""); setCreateOpen(true); }}
        >
          Add Event
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <Calendar
            localizer={localizer}
            events={events}
            view={view}
            onView={setView}
            date={currentDate}
            onNavigate={setCurrentDate}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            style={{ height: "calc(100vh - 220px)" }}
          />
        </Box>
      )}

      {/* Create Event Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Schedule Event</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Job</InputLabel>
            <Select
              value={form.jobId}
              label="Job"
              onChange={(e) => setForm((f) => ({ ...f, jobId: e.target.value }))}
            >
              {jobs.map((j) => (
                <MenuItem key={j.id} value={String(j.id)}>
                  #{j.jobNumber} — {j.projectName || j.clientName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Technician</InputLabel>
            <Select
              value={form.personalInfoId}
              label="Technician"
              onChange={(e) => setForm((f) => ({ ...f, personalInfoId: e.target.value }))}
            >
              {people.map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {p.firstName} {p.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start"
            type="datetime-local"
            value={form.startDateTime}
            onChange={(e) => setForm((f) => ({ ...f, startDateTime: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            label="End"
            type="datetime-local"
            value={form.endDateTime}
            onChange={(e) => setForm((f) => ({ ...f, endDateTime: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            multiline
            rows={2}
            fullWidth
          />

          {saveError && (
            <Typography color="error" variant="body2">{saveError}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={18} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Event Details</DialogTitle>
        {selectedEvent && (
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body1">
              <strong>Job:</strong> #{selectedEvent.job.jobNumber}
            </Typography>
            {selectedEvent.job.projectName && (
              <Typography variant="body2" color="text.secondary">
                {selectedEvent.job.projectName}
              </Typography>
            )}
            {selectedEvent.personalInfo && (
              <Typography variant="body1">
                <strong>Technician:</strong> {selectedEvent.personalInfo.firstName} {selectedEvent.personalInfo.lastName}
              </Typography>
            )}
            <Typography variant="body1">
              <strong>Start:</strong> {new Date(selectedEvent.startDateTime).toLocaleString()}
            </Typography>
            <Typography variant="body1">
              <strong>End:</strong> {new Date(selectedEvent.endDateTime).toLocaleString()}
            </Typography>
            {selectedEvent.status && (
              <Typography variant="body1">
                <strong>Status:</strong> {selectedEvent.status}
              </Typography>
            )}
            {selectedEvent.description && (
              <Typography variant="body1">
                <strong>Notes:</strong> {selectedEvent.description}
              </Typography>
            )}
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleCalendarView;
