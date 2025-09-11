import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

type FormFields = {
  proctorTestNo: number;
  proctorIdNo: number;
  name: string;
  proctorType: "Standard" | "Modified";
  density: number;
  correctedDensity: number;
  optimumMoistureContent: number;
  oversizePercentage: number;
};

const ProctorDetails = () => {
  const form = useForm<FormFields>({
    defaultValues: {
      proctorTestNo: 101,
      proctorIdNo: 123,
      name: "",
      proctorType: "Modified",
      density: undefined,
      correctedDensity: undefined,
      optimumMoistureContent: undefined,
      oversizePercentage: undefined,
    },
  });
  const { register, handleSubmit } = form;

  const jobId = 1;

  const onSubmit = (data: FormFields) => {
    console.log(data);
  };

  const handleCancel = () => {
    console.log("Cancel");
  };

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId}`}
        subtitle={`Switch Proctor`}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack id="proctor-info" sx={{ mb: 10 }} gap={2}>
            <Typography variant="h5">Proctor Details</Typography>

            {/* <Stack gap={1} sx={{ mb: 2 }}> */}
            <Stack gap={1} direction="row">
              <TextField
                {...register("proctorTestNo")}
                label="Proctor Test No."
              />
              <TextField {...register("proctorIdNo")} label="Proctor ID" />
            </Stack>

            <TextField {...register("name")} label="Name" />

            <Controller
              name="proctorType"
              control={form.control}
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
              label="Density"
              {...register("density")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg/m³</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Corrected Density"
              {...register("correctedDensity")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg/m³</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Optimum Moisture Content"
              fullWidth={false}
              {...register("optimumMoistureContent")}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
            <TextField
              label="Oversize Percentage"
              {...register("oversizePercentage")}
              fullWidth={false}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Stack>

          {/* Buttons */}
          <Stack
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
          </Stack>
        </form>
      </Container>
    </>
  );
};
export default ProctorDetails;
