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
        backgroundColor: '#424242', 
        display: 'flex', 
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Title Section */}
        <Box sx={{ 
          backgroundColor: '#757575', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center',
          px: 3,
          minWidth: 200
        }}>
          {/* Avatar Circle */}
          <Avatar 
            sx={{ 
              bgcolor: '#E1BEE7', 
              color: 'white', 
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
          backgroundColor: '#757575',
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
                backgroundColor: '#E1BEE7',
                color: '#424242',
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#CE93D8'
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
                backgroundColor: '#E1BEE7',
                color: '#424242',
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#CE93D8'
                }
              }}
              startIcon={<AddIcon />}
            >
              Create Job
            </Button>

            {/* Enter Proctor Button */}
            <Button
              variant="contained"
              onClick={() => handleNavigation('enterProctor')}
              sx={{
                backgroundColor: '#E1BEE7',
                color: '#424242',
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#CE93D8'
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
          backgroundColor: 'white',
          borderLeft: '1px solid #e0e0e0'
        }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  )
}

export default LabAdminDashboard;
