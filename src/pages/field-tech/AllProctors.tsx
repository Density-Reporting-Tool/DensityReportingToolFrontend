import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Stack,
  Box,
  Typography,
  Container,
  Button,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import { proctorApi } from "@/services/api/proctorApiService";
import { ProctorReadDTO } from "@/dtos/Proctor/proctor";
import { ApiResponse } from "@/types/api";

const AllProctors = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [proctors, setProctors] = useState<ProctorReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProctors = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        const data = await proctorApi.getByJobId(Number(jobId));
        setProctors(data);
        setError(null);
      } catch (err: any) {
        const apiError = err as ApiResponse<null>;
        setError(apiError.message || "Failed to load proctors");
      } finally {
        setLoading(false);
      }
    };

    fetchProctors();
  }, [jobId]);

  const handleClickProctor = (proctor: ProctorReadDTO) => {
    navigate(`/proctors/${proctor.id}`, { state: { proctor } });
  };

  const handleNewProctor = () => {
    navigate("/lab-admin/add-proctor");
  };

  if (loading) {
    return (
      <>
        <HeaderWithBackButton title={`Job #${jobId}`} />
        <Container maxWidth="xl" sx={{ my: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderWithBackButton title={`Job #${jobId}`} />
        <Container maxWidth="xl" sx={{ my: 3 }}>
          <Typography color="error">{error}</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <HeaderWithBackButton title={`Job #${jobId}`} />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Proctors</Typography>
          <Button
            variant="contained"
            disableElevation
            sx={{ borderRadius: 10 }}
            onClick={handleNewProctor}
          >
            <AddIcon />
          </Button>
        </Box>

        {proctors.length === 0 ? (
          <Typography color="text.secondary">No proctors found for this job.</Typography>
        ) : (
          <Stack spacing={1}>
            {proctors.map((proctor) => (
              <Card
                key={proctor.id}
                elevation={0}
                sx={{
                  borderRadius: "10px",
                  border: "1px lightgrey solid",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 3 },
                  p: 2,
                }}
                onClick={() => handleClickProctor(proctor)}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {proctor.proctorID} — {proctor.materialType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: {proctor.proctorType?.type ?? `ID ${proctor.proctorTypeId}`}
                    </Typography>
                    {proctor.maxDensity != null && (
                      <Typography variant="body2" color="text.secondary">
                        Max Density: {proctor.maxDensity} kg/m³
                      </Typography>
                    )}
                    {proctor.correctedDensity != null && (
                      <Typography variant="body2" color="text.secondary">
                        Corrected Density: {proctor.correctedDensity} kg/m³
                      </Typography>
                    )}
                    {proctor.optimumMoistureContent != null && (
                      <Typography variant="body2" color="text.secondary">
                        Optimum Moisture: {proctor.optimumMoistureContent}%
                      </Typography>
                    )}
                  </Box>
                  <ChevronRightIcon color="action" />
                </Box>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </>
  );
};

export default AllProctors;
