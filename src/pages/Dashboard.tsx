import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Divider
} from '@mui/material'
import {
  Search as SearchIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material'

// Mock data
const todaysSchedule = [
  { time: '7:00am', jobNumber: '000001' },
  { time: '9:00am', jobNumber: '000002' },
  { time: '5:00pm', jobNumber: '000003' }
]

const reportsInProgress = [
  { period: 'May 1 - May 31', reports: [
    { jobNumber: '000101', reportNumber: '2' },
    { jobNumber: '000102', reportNumber: '15' },
    { jobNumber: '000103', reportNumber: '7' },
    { jobNumber: '000104', reportNumber: '35' }
  ]},
  { period: 'June 1 - June 30', reports: [
    { jobNumber: '000001', reportNumber: '4' },
    { jobNumber: '000021', reportNumber: '4', note: 'Jakub - Needs Edits' }
  ]}
]

const Dashboard: React.FC = () => {
  const navigate = useNavigate()

  const handleJobClick = (jobNumber: string) => {
    navigate(`/job/${jobNumber}`)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            GEOPACIFIC
          </Typography>
          <IconButton size="small" sx={{ ml: 'auto' }}>
            <InfoIcon color="secondary" />
          </IconButton>
        </Box>
        
        {/* Search Bar */}
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            placeholder="Enter Job Number"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small">
                    <InfoIcon color="secondary" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'white'
              }
            }}
          />
        </Box>
      </Box>

      {/* Today's Schedule */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
          Today's Schedule
        </Typography>
        <Stack spacing={1}>
          {todaysSchedule.map((schedule, index) => (
            <Card 
              key={index}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => handleJobClick(schedule.jobNumber)}
            >
              <CardContent sx={{ py: 2, px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {schedule.time} Job #{schedule.jobNumber}
                  </Typography>
                  <IconButton size="small">
                    <InfoIcon color="secondary" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Reports In Progress */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
          Reports In Progress
        </Typography>
        
        {reportsInProgress.map((period, periodIndex) => (
          <Box key={periodIndex} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {period.period}
              </Typography>
              <IconButton size="small" sx={{ ml: 1 }}>
                <InfoIcon color="secondary" fontSize="small" />
              </IconButton>
            </Box>
            
            <Stack spacing={1}>
              {period.reports.map((report, reportIndex) => (
                <Card 
                  key={reportIndex}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => handleJobClick(report.jobNumber)}
                >
                  <CardContent sx={{ py: 2, px: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Job #{report.jobNumber} Report #{report.reportNumber}
                        </Typography>
                        {report.note && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {report.note}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    </Container>
  )
}

export default Dashboard 