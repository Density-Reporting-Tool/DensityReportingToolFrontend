import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  SelectChangeEvent,
  Autocomplete
} from '@mui/material'
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material'

const LabAdminCreateJob: React.FC = () => {
  const [projectManager, setProjectManager] = useState('Jakub Szary')
  const [client, setClient] = useState('GeoPacific')

  // Sample client options - you can expand this list
  const clientOptions = [
    'GeoPacific',
    'City of Vancouver',
    'Metro Vancouver',
    'BC Ministry of Transportation',
    'Private Developer A',
    'Private Developer B'
  ]

  // Sample project manager options
  const projectManagerOptions = [
    'Jakub Szary',
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Brown'
  ]

  const handleProjectManagerChange = (event: any, newValue: string | null) => {
    setProjectManager(newValue || '')
  }

  const handleClientChange = (event: any, newValue: string | null) => {
    setClient(newValue || '')
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
          <Box sx={{ width: '90%' }}>
            {/* Schedule Button */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'white',
                color: '#424242',
                fontWeight: 'bold',
                py: 1.5,
                mb: 2,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              Schedule
            </Button>

            {/* Enter Proctor Button */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'white',
                color: '#424242',
                fontWeight: 'bold',
                py: 1.5,
                mb: 2,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              Enter Proctor
            </Button>

            {/* Create Job Button - Active State */}
            <Button
              variant="contained"
              fullWidth
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
            >
              Create Job
            </Button>
          </Box>
        </Box>

        {/* Main Content Area - Job Details Form */}
        <Box sx={{ 
          flex: 1, 
          backgroundColor: '#F3E5F5',
          p: 4
        }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Job Details
          </Typography>

          <Box sx={{ maxWidth: 600 }}>
            {/* Job Number */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Job Number
              </Typography>
              <TextField
                fullWidth
                value="25900"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 1
                  }
                }}
              />
            </Box>

            {/* Project Manager */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Project Manager
              </Typography>
              <Autocomplete
                value={projectManager}
                onChange={handleProjectManagerChange}
                options={projectManagerOptions}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 1
                      }
                    }}
                  />
                )}
                sx={{
                  '& .MuiAutocomplete-popupIndicator': {
                    color: '#666'
                  }
                }}
              />
            </Box>

            {/* Client */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Client
              </Typography>
              <Autocomplete
                value={client}
                onChange={handleClientChange}
                options={clientOptions}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 1
                      }
                    }}
                  />
                )}
                sx={{
                  '& .MuiAutocomplete-popupIndicator': {
                    color: '#666'
                  }
                }}
              />
            </Box>

            {/* Project Name */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Project Name
              </Typography>
              <TextField
                fullWidth
                value="West Parking Lot Improvement"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 1
                  }
                }}
              />
            </Box>

            {/* Site Address */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Site Address
              </Typography>
              <TextField
                fullWidth
                value="1779 W 75th Ave, Vancouver, BC V6P 3T1"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 1
                  }
                }}
              />
            </Box>

            {/* Job Notes */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Job Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis ante ut eros venenatis lacinia ut in nisl. Sed malesuada risus in nisi convallis aliquet. Aliquam convallis scelerisque gravida."
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 1
                  }
                }}
              />
            </Box>

            {/* Start Date */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Start Date
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  value="August 15, 2025"
                  variant="outlined"
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 1
                    }
                  }}
                />
                <CalendarIcon sx={{ color: '#666', fontSize: 20 }} />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
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
              >
                Edit Distribution List
              </Button>
              <Button
                variant="contained"
                fullWidth
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
              >
                Save Job
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LabAdminCreateJob;
