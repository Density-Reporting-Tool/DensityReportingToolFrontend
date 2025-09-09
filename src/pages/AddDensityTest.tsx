import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Container,
  Stack,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import HeaderTitle from "@/components/headers/HeaderTitle";
import { apiService } from "../services/apiService";

// Types
interface Proctor {
  id: number;
  proctorID: string;
  maxDensity: number | null;
  correctedDensity: number | null;
  optimumMoistureContent: number | null;
  specificGravity: number | null;
  proctorType: string;
  materialType: string | null;
}

interface DensityTestFormData {
  proctorId: string;
  testArea: string;
  location: string;
  elevationReference: string;
  elevationValue: number;
  elevationUnit: string;
  correctedOversizePercentage: number;
  probeDepth: number;
  probeDepthUnit: string;
  compactionSpecification: number;
  compactionSpecificationUnit: string;
  densityValue: number;
  moistureValue: number;
}

const AddDensityTest: React.FC = () => {
  const { jobId, reportId } = useParams<{ jobId: string; reportId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug logging
  console.log('AddDensityTest - URL params - JobId:', jobId, 'ReportId:', reportId);
  console.log('AddDensityTest - Navigation state:', location.state);
  
  // State
  const [proctors, setProctors] = useState<Proctor[]>([]);
  const [selectedProctor, setSelectedProctor] = useState<Proctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<DensityTestFormData>({
    proctorId: "",
    testArea: "",
    location: "",
    elevationReference: "AboveSubgrade",
    elevationValue: 0,
    elevationUnit: "Meters",
    correctedOversizePercentage: 0,
    probeDepth: 0,
    probeDepthUnit: "Cm",
    compactionSpecification: 95,
    compactionSpecificationUnit: "SPDD",
    densityValue: 0,
    moistureValue: 0,
  });

  // Fetch proctors on component mount
  useEffect(() => {
    if (jobId) {
      fetchProctors();
    }
  }, [jobId]);

  const fetchProctors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getProctorsForJob(parseInt(jobId!));
      setProctors(response.data || []);
    } catch (err: any) {
      console.error('Error fetching proctors:', err);
      setError(err.message || 'Failed to load proctors');
    } finally {
      setLoading(false);
    }
  };

  const handleProctorChange = (proctorId: string) => {
    const proctor = proctors.find(p => p.id === parseInt(proctorId));
    setSelectedProctor(proctor || null);
    setFormData(prev => ({
      ...prev,
      proctorId,
      compactionSpecification: 95 // Default to 95% compaction specification
    }));
  };

  const handleInputChange = (field: keyof DensityTestFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (formData.proctorId === "" || formData.proctorId === "0") {
      setError('Please select a proctor');
      return;
    }

    if (!reportId) {
      setError('Report ID not found. Please try again.');
      return;
    }

    // Validate compaction specification range
    if (formData.compactionSpecification < 0 || formData.compactionSpecification > 110) {
      setError('Compaction specification must be between 0 and 110%');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare density test data for API
      const densityTestData = {
        proctorId: parseInt(formData.proctorId),
        testArea: formData.testArea,
        location: formData.location,
        elevationReference: formData.elevationReference,
        elevationValue: formData.elevationValue,
        elevationUnit: formData.elevationUnit,
        correctedOversizePercentage: formData.correctedOversizePercentage,
        probeDepth: formData.probeDepth,
        probeDepthUnit: formData.probeDepthUnit,
        compactionSpecification: formData.compactionSpecification,
        compactionSpecificationUnit: formData.compactionSpecificationUnit,
        densityValue: formData.densityValue,
        moistureValue: formData.moistureValue
      };
      
      console.log("Creating density test for report:", reportId, densityTestData);
      
      // Create density test via API
      const response = await apiService.createDensityTest(parseInt(reportId), densityTestData);
      
      if (response.data) {
        setSuccess(true);
        
        // Navigate back to report details page
        setTimeout(() => {
          navigate(`/job/${jobId}/report/${reportId}`);
        }, 1500);
      } else {
        setError(response.message || 'Failed to create density test');
      }
      
    } catch (err: any) {
      console.error('Error saving density test:', err);
      setError(err.message || 'Failed to save density test');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && proctors.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate(-1)} variant="outlined">
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId}`}
        subtitle="Add Density Test"
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Density test added successfully! Returning to report...
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <HeaderTitle title="Density Test Details" />
        
        <Stack gap={2}>
          {/* Proctor Selection */}
          <Paper sx={{ padding: 2, borderRadius: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Proctor</InputLabel>
              <Select
                value={formData.proctorId}
                onChange={(e) => handleProctorChange(e.target.value)}
                label="Proctor"
              >
                {proctors.map((proctor) => (
                  <MenuItem key={proctor.id} value={proctor.id.toString()}>
                    {proctor.proctorID} - {proctor.proctorType} ({proctor.materialType})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* Selected Proctor Info */}
          {selectedProctor && (
            <Paper sx={{ padding: 2, borderRadius: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Proctor Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Max Density:</strong> {selectedProctor.maxDensity || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Optimum Moisture:</strong> {selectedProctor.optimumMoistureContent || 'N/A'}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Corrected Density:</strong> {selectedProctor.correctedDensity || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Specific Gravity:</strong> {selectedProctor.specificGravity || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Test Location */}
          <Paper sx={{ padding: 2, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Test Area"
                  value={formData.testArea}
                  onChange={(e) => handleInputChange('testArea', e.target.value)}
                  placeholder="e.g., Grid AB-07"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Station 100+50"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Elevation */}
          <Paper sx={{ padding: 2, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Elevation Reference</InputLabel>
                  <Select
                    value={formData.elevationReference}
                    onChange={(e) => handleInputChange('elevationReference', e.target.value)}
                    label="Elevation Reference"
                  >
                    <MenuItem value="AboveSubgrade">Above Subgrade</MenuItem>
                    <MenuItem value="BelowSubgrade">Below Subgrade</MenuItem>
                    <MenuItem value="AboveFinalGrade">Above Final Grade</MenuItem>
                    <MenuItem value="BelowFinalGrade">Below Final Grade</MenuItem>
                    <MenuItem value="Geodetic">Geodetic</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Elevation Value"
                  type="number"
                  value={formData.elevationValue}
                  onChange={(e) => handleInputChange('elevationValue', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={formData.elevationUnit}
                    onChange={(e) => handleInputChange('elevationUnit', e.target.value)}
                    label="Unit"
                  >
                    <MenuItem value="Meters">Meters</MenuItem>
                    <MenuItem value="Feet">Feet</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Test Parameters */}
          <Paper sx={{ padding: 2, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Corrected Oversize %"
                  type="number"
                  value={formData.correctedOversizePercentage}
                  onChange={(e) => handleInputChange('correctedOversizePercentage', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Probe Depth"
                  type="number"
                  value={formData.probeDepth}
                  onChange={(e) => handleInputChange('probeDepth', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Probe Depth Unit</InputLabel>
                  <Select
                    value={formData.probeDepthUnit}
                    onChange={(e) => handleInputChange('probeDepthUnit', e.target.value)}
                    label="Probe Depth Unit"
                  >
                    <MenuItem value="Cm">Centimeters</MenuItem>
                    <MenuItem value="Inch">Inches</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Compaction Specification */}
          <Paper sx={{ padding: 2, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Compaction Specification (%)"
                  type="number"
                  value={formData.compactionSpecification}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    if (value >= 0 && value <= 110) {
                      handleInputChange('compactionSpecification', value);
                    }
                  }}
                  placeholder="95"
                  inputProps={{ min: 0, max: 110 }}
                  error={formData.compactionSpecification < 0 || formData.compactionSpecification > 110}
                  helperText={formData.compactionSpecification < 0 || formData.compactionSpecification > 110 ? "Must be between 0 and 110%" : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Specification Unit</InputLabel>
                  <Select
                    value={formData.compactionSpecificationUnit}
                    onChange={(e) => handleInputChange('compactionSpecificationUnit', e.target.value)}
                    label="Specification Unit"
                  >
                    <MenuItem value="SPDD">SPDD</MenuItem>
                    <MenuItem value="MPDD">MPDD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Test Results */}
          <Paper sx={{ padding: 2, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Density Value"
                  type="number"
                  value={formData.densityValue}
                  onChange={(e) => handleInputChange('densityValue', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Moisture Value (%)"
                  type="number"
                  value={formData.moistureValue}
                  onChange={(e) => handleInputChange('moistureValue', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Save Button */}
          <Paper sx={{ padding: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSave}
                disabled={saving || formData.proctorId === "" || formData.proctorId === "0"}
              >
                {saving ? "Saving..." : "Add Density Test"}
              </Button>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </>
  );
};

export default AddDensityTest;
