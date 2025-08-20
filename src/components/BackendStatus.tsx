import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material'
import { apiService } from '../services/apiService'
import { API_CONFIG, isRenderBackend } from '../config/api'

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [backendUrl, setBackendUrl] = useState('')

  useEffect(() => {
    setBackendUrl(API_CONFIG.BASE_URL)
  }, [])

  const testConnection = async () => {
    setStatus('loading')
    setMessage('')
    
    try {
      // Try multiple endpoints to test connectivity
      let response
      let endpoint = ''
      
      // First try health endpoint (most reliable)
      try {
        response = await apiService.get('/health')
        endpoint = 'health (/health)'
      } catch (healthError) {
        // Try home endpoint
        try {
          response = await apiService.get('/home')
          endpoint = 'home (/home)'
        } catch (homeError) {
          // Try API health endpoint
          try {
            response = await apiService.get('/api/health')
            endpoint = 'api health (/api/health)'
          } catch (apiHealthError) {
            throw new Error('All endpoints failed. Backend might be down or endpoints are different.')
          }
        }
      }
      
      setStatus('success')
      setMessage(`Backend connected successfully via ${endpoint}! Status: ${response.status}`)
    } catch (error: any) {
      setStatus('error')
      setMessage(`Connection failed: ${error.message}`)
      console.error('Backend connection error:', error)
    }
  }

  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Backend Connection Status
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Backend URL: {backendUrl}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Environment: {isRenderBackend() ? 'Production (Render)' : 'Development (Local)'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Full API URL: {backendUrl}/api/health
        </Typography>
      </Box>

      <Button 
        variant="contained" 
        onClick={testConnection}
        disabled={status === 'loading'}
        sx={{ mb: 2, mr: 2 }}
      >
        {status === 'loading' ? (
          <>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            Testing...
          </>
        ) : (
          'Test Connection'
        )}
      </Button>

      <Button 
        variant="outlined" 
        onClick={async () => {
          setStatus('loading')
          try {
            // Test with different endpoints and show detailed info
            const endpoints = ['/', '/api', '/api/health', '/health', '/status', '/swagger', '/swagger/index.html']
            let successEndpoint = ''
            let lastError = ''
            
            for (const endpoint of endpoints) {
              try {
                const response = await fetch(`${backendUrl}${endpoint}`)
                if (response.ok) {
                  successEndpoint = endpoint
                  break
                } else {
                  lastError = `Endpoint ${endpoint}: ${response.status} ${response.statusText}`
                }
              } catch (error: any) {
                lastError = `Endpoint ${endpoint}: ${error.message}`
              }
            }
            
            if (successEndpoint) {
              setStatus('success')
              setMessage(`Found working endpoint: ${successEndpoint}`)
            } else {
              setStatus('error')
              setMessage(`All endpoints failed. Last error: ${lastError}`)
            }
          } catch (error: any) {
            setStatus('error')
            setMessage(`Test failed: ${error.message}`)
          }
        }}
        disabled={status === 'loading'}
        sx={{ mb: 2 }}
      >
        Test All Endpoints
      </Button>

      <Button 
        variant="outlined" 
        onClick={async () => {
          setStatus('loading')
          try {
            // Test with headers that might help with .NET Core
            const response = await fetch(backendUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'DensityReportingTool-Frontend/1.0'
              }
            })
            
            setStatus('success')
            setMessage(`Response: ${response.status} ${response.statusText}. Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`)
          } catch (error: any) {
            setStatus('error')
            setMessage(`Detailed test failed: ${error.message}`)
          }
        }}
        disabled={status === 'loading'}
        sx={{ mb: 2 }}
      >
        Test with Headers
      </Button>

      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary">
        <strong>Note:</strong> Make sure your Render backend is running and accessible.
        If you get CORS errors, ensure your backend allows requests from your frontend domain.
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        <strong>Debug Info:</strong> Check browser console for detailed error messages.
        Common issues: CORS policy, backend not running, or incorrect endpoints.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        <strong>Current Status:</strong> Backend is running but has database connection issues.
        Check Render dashboard for missing environment variables (DB_SSLMODE, DB_HOST, etc.).
      </Typography>
    </Box>
  )
}

export default BackendStatus
