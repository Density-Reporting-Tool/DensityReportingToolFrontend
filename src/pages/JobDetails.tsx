import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  Stack,
  Divider,
  Chip
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material'

// Mock data
const jobData = {
  jobNumber: '000001',
  address: '123 Main St, Vancouver, BC',
  contacts: [
    { initials: 'JS', name: 'Project Manager Jakub Szary', role: 'Project Manager' },
    { initials: 'MK', name: 'Site Contact Matt Kokan', role: 'Site Contact' }
  ],
  notes: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ],
  recentReports: [
    {
      id: 4,
      initials: 'IC',
      description: 'Description duis aute irure dolor in reprehenderit in voluptate',
      date: 'Today'
    },
    {
      id: 3,
      initials: 'PS',
      description: 'Description duis aute irure dolor in reprehenderit in voluptate velit.',
      date: 'Two weeks ago'
    }
  ]
}

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }

  const handleNewReport = () => {
    // Handle new report creation
    console.log('Create new report for job:', jobId)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Job #{jobData.jobNumber}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocationIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body1" color="text.secondary">
            Address: {jobData.address}
          </Typography>
        </Box>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Contact Information
        </Typography>
        <Stack direction="row" spacing={2}>
          {jobData.contacts.map((contact, index) => (
            <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: 'primary.main', 
                  fontSize: '1.25rem',
                  mx: 'auto',
                  mb: 1
                }}
              >
                {contact.initials}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {contact.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {contact.role}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Notes Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Typography variant="h6">
            Notes
          </Typography>
          {/* Overlapping icons */}
          <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
            <Stack direction="row" spacing={0.5}>
              <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: '0.625rem' }}>
                J
              </Avatar>
              <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: '0.625rem' }}>
                I
              </Avatar>
            </Stack>
          </Box>
        </Box>
        
        <Card>
          <CardContent>
            {jobData.notes.map((note, index) => (
              <Box key={index} sx={{ mb: index < jobData.notes.length - 1 ? 2 : 0 }}>
                <Typography variant="body2" color="text.secondary">
                  {note}
                </Typography>
                {index < jobData.notes.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>

      {/* Recent Reports */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
          position: 'relative'
        }}>
          <Typography variant="h6">
            Recent Reports
          </Typography>
          {/* Overlapping icons */}
          <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
            <Stack direction="row" spacing={0.5}>
              <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: '0.625rem' }}>
                J
              </Avatar>
              <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: '0.625rem' }}>
                I
              </Avatar>
            </Stack>
          </Box>
          <Typography 
            variant="body2" 
            color="secondary.main" 
            sx={{ 
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Show all
          </Typography>
        </Box>
        
        <Stack spacing={1}>
          {jobData.recentReports.map((report, index) => (
            <Card key={report.id} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
              <CardContent sx={{ py: 2, px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: 'primary.main', 
                        fontSize: '0.875rem',
                        mr: 2
                      }}
                    >
                      {report.initials}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Report {report.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {report.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {report.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ChevronRightIcon color="action" />
                    {/* Overlapping icons */}
                    <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
                      <Stack direction="row" spacing={0.5}>
                        <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: '0.625rem' }}>
                          J
                        </Avatar>
                        <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: '0.625rem' }}>
                          I
                        </Avatar>
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* New Report Button */}
      <Box sx={{ position: 'fixed', bottom: 20, left: 20, right: 20 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewReport}
          sx={{
            py: 1.5,
            borderRadius: 3,
            boxShadow: 3
          }}
        >
          New Report
        </Button>
        <IconButton 
          size="small" 
          sx={{ 
            position: 'absolute', 
            right: -40, 
            top: '50%', 
            transform: 'translateY(-50%)',
            bgcolor: 'white',
            boxShadow: 1
          }}
        >
          <InfoIcon color="secondary" />
        </IconButton>
      </Box>
    </Container>
  )
}

export default JobDetails 