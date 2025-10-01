import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { UNITS } from "@/utils/constants";
import { ProctorData } from "@/types/proctors";
import { InfoOutlined } from "@mui/icons-material";
import NoPhoto from "../photo/NoPhoto";
import { useNavigate } from "react-router-dom";

interface ProctorCardType {
  index?: number;
  selectedIndex?: number;
  proctor: ProctorData;
  handleClick: () => void;
}

const ProctorCard: React.FC<ProctorCardType> = ({
  index,
  selectedIndex,
  proctor,
  handleClick,
}) => {
  const navigate = useNavigate();
  const handleOpenDetails = () => {
    console.log(proctor);
    // TODO: ensure id is defined
    navigate(`/proctors/${proctor.id}`, { state: { proctor } });
  };
  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: "10px",
          boxShadow: "1px",
          border:
            selectedIndex == index ? "4px green solid" : "1px lightgrey solid",
          padding: 0.5,
        }}
        onClick={handleClick}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Image */}
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
            {/* Proctor Details */}
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
          </Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetails();
            }}
          >
            <InfoOutlined />
          </IconButton>
        </Stack>
      </Card>
    </>
  );
};
export default ProctorCard;
