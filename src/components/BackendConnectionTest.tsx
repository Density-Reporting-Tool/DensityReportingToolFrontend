import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Stack, Alert } from '@mui/material';
import { CheckCircle, Error, Refresh } from '@mui/icons-material';
import { apiService } from '../services/apiService';
import { API_CONFIG } from '../config/api';

interface ConnectionStatus {
  isConnected: boolean;
  responseTime: number | null;
  error: string | null;
  lastChecked: Date | null;
}

const BackendConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    responseTime: null,
    error: null,
    lastChecked: null,
  });
  const [isTesting, setIsTesting] = useState(false);

  const testConnection = async () => {
    setIsTesting(true);
    const startTime = Date.now();
    
    try {
      // Test with a simple endpoint - you can change this to match your backend
      await apiService.get('/api/test/health');
      const responseTime = Date.now() - startTime;
      
      setStatus({
        isConnected: true,
        responseTime,
        error: null,
        lastChecked: new Date(),
      });
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime;
      setStatus({
        isConnected: false,
        responseTime,
        error: (error as Error)?.message || 'Unknown error',
        lastChecked: new Date(),
      });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    // Test connection on component mount
    testConnection();
  }, []);

  return (
    <Card sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Backend Connection Test
      </Typography>
      
      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Backend URL: {API_CONFIG.BASE_URL}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Environment: {import.meta.env.NODE_ENV}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {status.isConnected ? (
            <CheckCircle color="success" />
          ) : (
            <Error color="error" />
          )}
          <Typography variant="body1">
            Status: {status.isConnected ? 'Connected' : 'Disconnected'}
          </Typography>
        </Box>

        {status.responseTime !== null && (
          <Typography variant="body2">
            Response Time: {status.responseTime}ms
          </Typography>
        )}

        {status.error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Error: {status.error}
          </Alert>
        )}

        {status.lastChecked && (
          <Typography variant="body2" color="text.secondary">
            Last Checked: {status.lastChecked.toLocaleTimeString()}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={testConnection}
          disabled={isTesting}
          startIcon={<Refresh />}
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
        </Button>
      </Stack>
    </Card>
  );
};

export default BackendConnectionTest;