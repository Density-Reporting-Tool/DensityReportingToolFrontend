import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
} from "@mui/material";
import type {
  ScheduleJobReadDTO,
  ScheduleJobCreateDTO,
  ScheduleJobUpdateDTO,
} from "@/dtos/Scheduling/scheduleJob";
import type { JobReadDTO } from "@/dtos/Job/job";
import type { PersonalInfoReadDTO } from "@/dtos/People/personalInfo";
import { schedulingApiService } from "@/services/schedulingApiService";

interface ScheduleEventDialogProps {
  open: boolean;
  onClose: () => void;
  initialEvent: ScheduleJobReadDTO | null;
  onSaved: (event: ScheduleJobReadDTO) => void;
  onDeleted?: (eventId: number) => void;
  jobs: JobReadDTO[];
  employees?: PersonalInfoReadDTO[];
  defaultStart?: string;
  defaultEnd?: string;
}

/** Converts an ISO UTC string to "YYYY-MM-DDTHH:mm" for datetime-local input. */
function toLocalDatetimeInput(isoUtc: string): string {
  if (!isoUtc) return "";
  const d = new Date(isoUtc);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ScheduleEventDialog({
  open,
  onClose,
  initialEvent,
  onSaved,
  onDeleted,
  jobs,
  employees = [],
  defaultStart,
  defaultEnd,
}: ScheduleEventDialogProps) {
  const [jobId, setJobId] = useState<number | "">("");
  const [personalInfoId, setPersonalInfoId] = useState<number | "">("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("Scheduled");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = initialEvent != null;

  useEffect(() => {
    if (!open) return;
    setErrors([]);
    if (initialEvent) {
      setJobId(initialEvent.jobId);
      setPersonalInfoId(initialEvent.personalInfoId);
      setStartDateTime(toLocalDatetimeInput(initialEvent.startDateTime));
      setEndDateTime(toLocalDatetimeInput(initialEvent.endDateTime));
      setDescription(initialEvent.description ?? "");
      setStatus(initialEvent.status ?? "Scheduled");
    } else {
      setJobId("");
      setPersonalInfoId("");
      setStartDateTime(defaultStart ? toLocalDatetimeInput(defaultStart) : "");
      setEndDateTime(defaultEnd ? toLocalDatetimeInput(defaultEnd) : "");
      setDescription("");
      setStatus("Scheduled");
    }
  }, [open, initialEvent, defaultStart, defaultEnd]);

  function validate(): boolean {
    const list: string[] = [];
    if (jobId === "" || jobId == null) list.push("Job is required.");
    if (personalInfoId === "" || personalInfoId == null)
      list.push("Person is required.");
    if (!startDateTime.trim()) list.push("Start date/time is required.");
    if (!endDateTime.trim()) list.push("End date/time is required.");
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime).getTime();
      const end = new Date(endDateTime).getTime();
      if (end <= start) list.push("End must be after start.");
    }
    setErrors(list);
    return list.length === 0;
  }

  function buildCreatePayload(): ScheduleJobCreateDTO {
    return {
      jobId: Number(jobId),
      personalInfoId: Number(personalInfoId),
      startDateTime: new Date(startDateTime).toISOString(),
      endDateTime: new Date(endDateTime).toISOString(),
      description: description.trim() || null,
      status: status || null,
    };
  }

  function buildUpdatePayload(): ScheduleJobUpdateDTO {
    return {
      id: initialEvent!.id,
      jobId: Number(jobId),
      personalInfoId: Number(personalInfoId),
      startDateTime: new Date(startDateTime).toISOString(),
      endDateTime: new Date(endDateTime).toISOString(),
      description: description.trim() || null,
      status: status || null,
    };
  }

  async function handleSave() {
    if (!validate()) return;
    setSubmitting(true);
    setErrors([]);
    try {
      if (isEdit) {
        const res = await schedulingApiService.updateScheduleJob(
          initialEvent!.id,
          buildUpdatePayload()
        );
        const body = res.data;
        if (body.success && body.data) {
          onSaved(body.data);
          onClose();
        } else {
          setErrors([body.message ?? "Update failed"].concat(body.errors ?? []));
        }
      } else {
        const res = await schedulingApiService.createScheduleJob(buildCreatePayload());
        const body = res.data;
        if (body.success && body.data) {
          onSaved(body.data);
          onClose();
        } else {
          setErrors([body.message ?? "Create failed"].concat(body.errors ?? []));
        }
      }
    } catch (err) {
      setErrors([err instanceof Error ? err.message : "Request failed"]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!initialEvent || !onDeleted) return;
    if (!window.confirm("Delete this scheduled event?")) return;
    setSubmitting(true);
    setErrors([]);
    try {
      const res = await schedulingApiService.deleteScheduleJob(initialEvent.id);
      const body = res.data;
      if (body.success) {
        onDeleted(initialEvent.id);
        onClose();
      } else {
        setErrors([body.message ?? "Delete failed"].concat(body.errors ?? []));
      }
    } catch (err) {
      setErrors([err instanceof Error ? err.message : "Request failed"]);
    } finally {
      setSubmitting(false);
    }
  }

  const jobList = Array.isArray(jobs) ? jobs : [];
  const employeeList = Array.isArray(employees) ? employees : [];
  const selectedJob = jobList.find((j) => j.id === jobId) ?? null;
  const selectedEmployee = employeeList.find((e) => e.id === personalInfoId) ?? null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit event" : "New event"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {errors.length > 0 && (
            <Alert severity="error" onClose={() => setErrors([])}>
              {errors.join(" ")}
            </Alert>
          )}

          <Autocomplete
            options={jobList}
            getOptionLabel={(job) => `${job.jobNumber} - ${job.siteAddress}`}
            value={selectedJob}
            onChange={(_, v) => setJobId(v?.id ?? "")}
            renderInput={(params) => (
              <TextField {...params} label="Job" required />
            )}
          />

          {employeeList.length > 0 ? (
            <Autocomplete
              options={employeeList}
              getOptionLabel={(emp) => `${emp.firstName} ${emp.lastName} (ID ${emp.id})`}
              value={selectedEmployee}
              onChange={(_, v) => setPersonalInfoId(v?.id ?? "")}
              renderInput={(params) => (
                <TextField {...params} label="Person" required />
              )}
            />
          ) : (
            <TextField
              label="Person ID"
              type="number"
              value={personalInfoId === "" ? "" : personalInfoId}
              onChange={(e) =>
                setPersonalInfoId(e.target.value === "" ? "" : Number(e.target.value))
              }
              required
              helperText="Enter a valid person ID."
            />
          )}

          


          <TextField
            label="Start"
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End"
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
          />
       
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        {isEdit && onDeleted && (
          <Button color="error" onClick={handleDelete} disabled={submitting}>
            Delete
          </Button>
        )}
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={submitting}>
          {submitting ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
