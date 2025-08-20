import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Science as ScienceIcon,
  Business as BusinessIcon
} from '@mui/icons-material'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <BusinessIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          GEOPACIFIC
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Density Reporting Tool
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Welcome to the GEOPACIFIC Density Reporting Tool. Choose your dashboard to get started.
        </Typography>
      </Box>

      {/* Navigation Cards */}
      <Grid container spacing={4} justifyContent="center">
        {/* Dashboard Card */}
        <Grid item xs={12} sm={6} md={5}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: 8 
              }
            }}
            onClick={() => handleNavigation('/dashboard')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <DashboardIcon sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Access job schedules, reports in progress, and density reporting tools.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Enter Dashboard
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Lab Admin Dashboard Card */}
        <Grid item xs={12} sm={6} md={5}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: 8 
              }
            }}
            onClick={() => handleNavigation('/lab-admin')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <ScienceIcon sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                Lab Admin
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Manage laboratory operations, equipment, personnel, and sample tracking.
              </Typography>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Enter Lab Admin
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Info */}
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Paper sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            This is a temporary landing page. Choose your destination above to access the main application.
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default LandingPage;
