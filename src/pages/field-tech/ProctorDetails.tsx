import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Container,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import { proctorApi } from "@/services/api/proctorApiService";
import { ProctorReadDTO } from "@/dtos/Proctor/proctor";
import { ApiResponse } from "@/types/api";
import { UNITS } from "@/utils/constants";

type FormFields = {
  proctorTestNumber: string;
  proctorID: string;
  materialType: string;
  proctorType: string;
  dateSampled: string;
  dateTested: string;
  maxDensity: number | null;
  correctedDensity: number | null;
  optimumMoistureContent: number | null;
  oversizePercentage: number | null;
  specificGravity: number | null;
  labLocation: string;
};

const ProctorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();

  const [loading, setLoading] = useState(!state?.proctor);
  const [error, setError] = useState<string | null>(null);
  const [proctor, setProctor] = useState<ProctorReadDTO | null>(
    state?.proctor ?? null,
  );

  const form = useForm<FormFields>({
    defaultValues: {
      proctorTestNumber: "",
      proctorID: "",
      materialType: "",
      proctorType: "",
      dateSampled: "",
      dateTested: "",
      maxDensity: null,
      correctedDensity: null,
      optimumMoistureContent: null,
      oversizePercentage: null,
      specificGravity: null,
      labLocation: "",
    },
  });

  const { register, reset, control } = form;

  useEffect(() => {
    if (state?.proctor) {
      populateForm(state.proctor);
      return;
    }

    if (!id) return;

    const fetchProctor = async () => {
      try {
        setLoading(true);
        const data = await proctorApi.getById(Number(id));
        setProctor(data);
        populateForm(data);
        setError(null);
      } catch (err: any) {
        const apiError = err as ApiResponse<null>;
        setError(apiError.message || "Failed to load proctor");
      } finally {
        setLoading(false);
      }
    };

    fetchProctor();
  }, [id]);

  const populateForm = (p: ProctorReadDTO) => {
    reset({
      proctorTestNumber: p.proctorTestNumber ?? "",
      proctorID: p.proctorID ?? "",
      materialType: p.materialType ?? "",
      proctorType: p.proctorType?.type ?? "",
      dateSampled: p.dateSampled ? p.dateSampled.substring(0, 10) : "",
      dateTested: p.dateTested ? p.dateTested.substring(0, 10) : "",
      maxDensity: p.maxDensity,
      correctedDensity: p.correctedDensity,
      optimumMoistureContent: p.optimumMoistureContent,
      oversizePercentage: p.oversizePercentage,
      specificGravity: p.specificGravity,
      labLocation: p.labLocation ?? "",
    });
  };

  if (loading) {
    return (
      <>
        <HeaderWithBackButton title="Proctor Details" />
        <Container maxWidth="xl" sx={{ my: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderWithBackButton title="Proctor Details" />
        <Container maxWidth="xl" sx={{ my: 3 }}>
          <Typography color="error">{error}</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <HeaderWithBackButton
        title={proctor?.proctorID ?? `Proctor #${id}`}
        subtitle="Proctor Details"
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <form>
          <Stack id="proctor-info" sx={{ mb: 10 }} gap={2}>
            <Typography variant="h5">Proctor Details</Typography>

            <Stack gap={1} direction="row">
              <TextField
                {...register("proctorTestNumber")}
                label="Proctor Test No."
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ width: "50%" }}
              />
              <TextField
                {...register("proctorID")}
                label="Proctor ID"
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ width: "50%" }}
              />
            </Stack>

            <TextField
              label="Material Type"
              {...register("materialType")}
              InputLabelProps={{ shrink: true }}
              disabled
            />

            <TextField
              label="Lab Location"
              {...register("labLocation")}
              InputLabelProps={{ shrink: true }}
              disabled
            />

            <Controller
              name="proctorType"
              control={control}
              disabled
              render={({ field }) => (
                <FormControl>
                  <TextField {...field} select label="Proctor Type" InputLabelProps={{ shrink: true }}>
                    <MenuItem value="Standard">Standard</MenuItem>
                    <MenuItem value="Modified">Modified</MenuItem>
                  </TextField>
                </FormControl>
              )}
            />

            <Stack gap={1} direction="row">
              <TextField
                label="Date Sampled"
                {...register("dateSampled")}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ width: "50%" }}
              />
              <TextField
                label="Date Tested"
                {...register("dateTested")}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ width: "50%" }}
              />
            </Stack>

            <TextField
              label="Max Density"
              {...register("maxDensity")}
              disabled
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{UNITS.density}</InputAdornment>
                ),
              }}
            />

            <TextField
              label="Corrected Density"
              {...register("correctedDensity")}
              disabled
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{UNITS.density}</InputAdornment>
                ),
              }}
            />

            <TextField
              label="Optimum Moisture Content"
              {...register("optimumMoistureContent")}
              disabled
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{UNITS.moisture}</InputAdornment>
                ),
              }}
            />

            <TextField
              label="Oversize Percentage"
              {...register("oversizePercentage")}
              disabled
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />

            <TextField
              label="Specific Gravity"
              {...register("specificGravity")}
              disabled
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{UNITS.specificGravity}</InputAdornment>
                ),
              }}
            />
          </Stack>
        </form>
      </Container>
    </>
  );
};

export default ProctorDetails;
