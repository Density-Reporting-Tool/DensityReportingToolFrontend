import { Box, Card, Stack, Typography } from "@mui/material";
import { UNITS } from "@/utils/constants";
import { ProctorData } from "@/types/proctors";
import NoPhoto from "../photo/NoPhoto";

interface ProctorCardType {
  index?: number;
  proctor: ProctorData;
  handleClick: () => void;
}

const ProctorCard: React.FC<ProctorCardType> = ({
  index,
  proctor,
  handleClick,
}) => {
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
          {proctor?.image_src ? (
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
              src={proctor?.image_src || "https://placehold.co/100"}
            />
          ) : (
            <NoPhoto width={100} height={100} />
          )}
          <Box sx={{ ml: 1 }}>
            <Typography variant="body1" fontWeight={600}>
              Proctor #{(index ?? 0) + 1}: {proctor?.materialType}
            </Typography>
            <Typography variant="body2">
              Density: {proctor?.maxDryDensity} {UNITS.density}
            </Typography>
            <Typography variant="body2">
              Corrected Density: {proctor?.correctedDensity} {UNITS.density}
            </Typography>
            <Typography variant="body2">
              Optimum Moisture: {proctor?.optimumMoisture}
              {UNITS.moisture}
            </Typography>
          </Box>
        </Stack>
      </Card>
    </>
  );
};
export default ProctorCard;
