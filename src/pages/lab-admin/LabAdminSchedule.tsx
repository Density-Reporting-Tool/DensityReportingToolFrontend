import React from "react";
import { Box, Typography } from "@mui/material";
import CalendarView from "../../components/calendar/fullCalendar";

const LabAdminSchedule: React.FC = () => {
  return (
    
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Schedule
      </Typography>
      <CalendarView />
    </Box>
  );
};

export default LabAdminSchedule;