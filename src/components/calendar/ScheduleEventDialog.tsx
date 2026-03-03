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
import type { GeoPacificEmployeeReadDTO } from "@/dtos/Scheduling/scheduleJob";
import { schedulingApiService } from "@/services/schedulingApiService";


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
  const [geoPacificEmployeeId, setGeoPacificEmployeeId] = useState<number | "">("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<string>("Scheduled");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = initialEvent != null;

  useEffect(() => {
    if (!open) return;
    setErrors([]);
    if (initialEvent) {
      setJobId(initialEvent.jobId);
      setGeoPacificEmployeeId(initialEvent.geoPacificEmployeeId);
      setStartDateTime(toLocalDatetimeInput(initialEvent.startDateTime));
      setEndDateTime(toLocalDatetimeInput(initialEvent.endDateTime));
      setDescription(initialEvent.description ?? "");
      setLocation(initialEvent.location ?? "");
      setStatus(initialEvent.status ?? "Scheduled");
    } else {
      setJobId("");
      setGeoPacificEmployeeId("");
      setStartDateTime(defaultStart ? toLocalDatetimeInput(defaultStart) : "");
      setEndDateTime(defaultEnd ? toLocalDatetimeInput(defaultEnd) : "");
      setDescription("");
      setLocation("");
      setStatus("Scheduled");
    }
  }, [open, initialEvent, defaultStart, defaultEnd]);




    return (

        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Schedule Event</DialogTitle>
            <DialogContent>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
