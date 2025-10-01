import { Box, Card, Stack, Typography } from "@mui/material";
import { ProctorData } from "../../services/lab-admin/proctorApiService";
import { UNITS } from "@/utils/constants";

interface ProctorCardType {
  proctor: ProctorData;
  handleClick: () => void;
}

const ProctorCard: React.FC<ProctorCardType> = ({ proctor, handleClick }) => {
  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: "10px",
          boxShadow: "1px",
          border: "1px lightgrey solid",
        }}
        onClick={handleClick}
      >
        <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            sx={{
              width: "100%",
              height: "auto",
              maxWidth: "100px",
              borderRadius: 2,
              mr: 2,
            }}
            alt="Report photos"
            src={proctor?.image_src}
          />
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {proctor?.materialType}
            </Typography>
            <Typography variant="body2">
              Density: {proctor?.maxDryDensity} {UNITS.density}
            </Typography>
            <Typography variant="body2">
              Corrected Density: {proctor?.correctedDensity} {UNITS.density}
            </Typography>
            <Typography variant="body2">
              Optimum Moisture: {proctor?.optimumMoisture} {UNITS.moisture}
            </Typography>
          </Box>
        </Stack>
      </Card>
    </>
  );
};
export default ProctorCard;
