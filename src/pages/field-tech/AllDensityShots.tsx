import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import { Paper, Box, Typography, Stack, Container, CircularProgress, Chip } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { reportsApiService } from "@/services/reportsApiService";
import { DensityTestInfo, ReportDetailResponse } from "@/dtos/report";

const AllDensityShots = () => {
  const { jobId, reportId } = useParams<{ jobId: string; reportId: string }>();
  const [densityTests, setDensityTests] = useState<DensityTestInfo[]>([]);
  const [reportNumber, setReportNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await reportsApiService.getReport(Number(reportId));
        const data = res.data as unknown as ReportDetailResponse;
        setDensityTests(data.densityTests ?? []);
        setReportNumber(data.reportNumber);
      } catch {
        setError("Failed to load density tests.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reportId]);

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId}`}
        subtitle={reportNumber !== null ? `Report ${reportNumber}` : `Report ${reportId}`}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Density Tests</Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && densityTests.length === 0 && (
          <Paper sx={{ padding: 2, borderRadius: 2 }}>No density tests yet.</Paper>
        )}

        <Stack gap={2}>
          {densityTests.map((test, index) => (
            <Paper
              key={test.id}
              sx={{ padding: 2, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <Box>
                <Typography variant="body1" fontWeight="700">
                  {test.testArea ?? `Density Test #${test.testNumber || index + 1}`}
                </Typography>
                {test.location && (
                  <Typography variant="body2">Location: {test.location}</Typography>
                )}
                <Typography variant="body2">
                  Elevation: {test.elevationValue} {test.elevationUnit ?? ""}
                  {test.elevationReference ? ` (${test.elevationReference})` : ""}
                </Typography>
                <Typography variant="body2">
                  Compaction: {test.compactionPercentage.toFixed(1)}% (spec: {test.compactionSpecification}
                  {test.compactionSpecificationUnit ?? "%"})
                </Typography>
                <Typography variant="body2">Density: {test.densityValue}</Typography>
              </Box>
              <Chip
                label={test.passed ? "PASS" : "FAIL"}
                color={test.passed ? "success" : "error"}
                size="small"
              />
            </Paper>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default AllDensityShots;
