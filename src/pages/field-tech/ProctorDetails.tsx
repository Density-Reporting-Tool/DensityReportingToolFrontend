import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import { UNITS } from "@/utils/constants";

import {
  Container,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

type FormFields = {
  proctorTestNo: number;
  proctorIdNo: number;
  name: string;
  proctorType: "Standard" | "Modified";
  dateTested: string;
  density: number;
  correctedDensity: number;
  optimumMoistureContent: number;
  oversizePercentage: number;
};

const ProctorDetails = () => {
  const { state } = useLocation();
  const proctor = state?.proctor;
  const form = useForm<FormFields>({
    defaultValues: {
      proctorTestNo: proctor.proctorTestNumber ?? "",
      proctorIdNo: proctor.proctorId ?? "",
      name: proctor.materialType ?? "",
      proctorType: proctor.proctorType ?? "",
      dateTested: proctor.dateTested ?? "",
      density: proctor.maxDryDensity ?? 0.0,
      correctedDensity: proctor.correctedDensity ?? 0.0,
      optimumMoistureContent: proctor.optimumMoisture ?? 0,
      oversizePercentage: proctor.oversizePercentage,
    },
  });

  const { register, handleSubmit } = form;

  const jobId = 1;

  const onSubmit = (data: FormFields) => {
    console.log(data);
  };

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId}`}
        subtitle={`Proctor Details`}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack id="proctor-info" sx={{ mb: 10 }} gap={2}>
            <Typography variant="h5">Proctor Details</Typography>

            <Stack gap={1} direction="row">
              <TextField
                {...register("proctorTestNo")}
                label="Proctor Test No."
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ width: "50%" }}
              />
              <TextField
                {...register("proctorIdNo")}
                label="Proctor ID"
                disabled
                sx={{ width: "50%" }}
              />
            </Stack>

            <TextField label="Name" {...register("name")} disabled />

            <Controller
              name="proctorType"
              control={form.control}
              disabled
              render={({ field }) => (
                <FormControl>
                  <TextField {...field} select label="Proctor Type">
                    <MenuItem value="Modified">Modified</MenuItem>
                    <MenuItem value="Standard">Standard</MenuItem>
                  </TextField>
                </FormControl>
              )}
            />
            <TextField
              label="Date Tested"
              {...register("dateTested")}
              disabled
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end"> </InputAdornment>,
              }}
            />
            <TextField
              label="Density"
              {...register("density")}
              disabled
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {" "}
                    {UNITS.density}
                  </InputAdornment>
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
                  <InputAdornment position="end">
                    {" "}
                    {UNITS.density}
                  </InputAdornment>
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
                  <InputAdornment position="end">
                    {UNITS.moisture}
                  </InputAdornment>
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
          </Stack>

          {/* Buttons */}
          {/* <Stack
            sx={{
              justifyContent: "center",
            }}
            gap={1}
          >
            <Box sx={{ display: "flex" }}>
              <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                Switch Proctor
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </Stack> */}
        </form>
      </Container>
    </>
  );
};
export default ProctorDetails;
