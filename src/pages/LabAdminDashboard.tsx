import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Stack
} from '@mui/material'
import {
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material'

const LabAdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [selectedSection, setSelectedSection] = useState<string>('')

  const handleNavigation = (section: string) => {
    setSelectedSection(section)
  }

  const handleCreateJob = () => {
    navigate('/lab-admin/create-job')
  }

  const handleEnterProctor = () => {
    navigate('/lab-admin/add-proctor')
  }

  const renderContent = () => {
    switch (selectedSection) {
      case 'schedule':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Schedule
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Schedule management content will appear here.
            </Typography>
          </Box>
        )
      case 'createJob':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Create Job
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Job creation form will appear here.
            </Typography>
          </Box>
        )
      case 'enterProctor':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Enter Proctor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Proctor entry form will appear here.
            </Typography>
          </Box>
        )
      default:
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: 'text.secondary'
          }}>
            <Typography variant="h6">
              Select an option from the sidebar to get started
            </Typography>
          </Box>
        )
    }
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <Box sx={{ 
        height: 64, 
        backgroundColor: 'primary.main', 
        display: 'flex', 
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Title Section */}
        <Box sx={{ 
          backgroundColor: 'primary.dark', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center',
          px: 3,
          minWidth: 200
        }}>
          {/* Avatar Circle */}
          <Avatar 
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main', 
              fontWeight: 'bold',
              fontSize: '1.2rem',
              width: 40,
              height: 40,
              mr: 2
            }}
          >
            LA
          </Avatar>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            Lab Admin
          </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar */}
        <Box sx={{ 
          width: 200, 
          backgroundColor: 'grey.100',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 3
        }}>
          <Stack spacing={2} sx={{ width: '90%' }}>
            {/* Schedule Button */}
            <Button
              variant="contained"
              onClick={() => handleNavigation('schedule')}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              startIcon={<ScheduleIcon />}
            >
              Schedule
            </Button>

            {/* Create Job Button */}
            <Button
              variant="contained"
              onClick={handleCreateJob}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              startIcon={<AddIcon />}
            >
              Create Job
            </Button>

            {/* Enter Proctor Button */}
            <Button
              variant="contained"
              onClick={handleEnterProctor}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              startIcon={<PersonIcon />}
            >
              Enter Proctor
            </Button>
          </Stack>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ 
          flex: 1, 
          backgroundColor: 'background.default',
          borderLeft: '1px solid grey.300'
        }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  )
}

export default LabAdminDashboard;
