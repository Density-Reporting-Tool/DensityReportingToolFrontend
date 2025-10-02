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

  interface ProctorCardField {
    field: string;
    variant: "body1" | "body2" | "h1" | "h2" | "subtitle1" | "subtitle2";
    fontWeight?: number;
  }

  const proctorCardFields: ProctorCardField[] = [
    {
      field: `Proctor #${(index ?? 0) + 1}: ${proctor?.materialType}`,
      variant: "body1",
      fontWeight: 600,
    },
    {
      field: `Density: ${proctor?.maxDryDensity} ${UNITS.density}`,
      variant: "body2",
    },
    {
      field: `Corrected Density: ${proctor?.correctedDensity} ${UNITS.density}`,
      variant: "body2",
    },
    {
      field: `Optimum Moisture: ${proctor?.optimumMoisture} ${UNITS.moisture}`,
      variant: "body2",
    },
  ];

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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              maxWidth: "85%",
            }}
          >
            {/* Image */}
            {proctor?.image_src ? (
              <Box
                component="img"
                sx={{
                  height: "auto",
                  maxWidth: 100,
                  borderRadius: 2,
                  mr: 2,
                  flexShrink: 0,
                }}
                alt="Report photos"
                src={proctor.image_src}
              />
            ) : (
              <NoPhoto width={100} height={100} />
            )}

            {/* Proctor Details */}
            <Box sx={{ ml: 1, maxWidth: "80%", overflow: "hidden" }}>
              {proctorCardFields.map((proctorField) => (
                <Typography
                  key={proctorField.field}
                  variant={proctorField.variant}
                  noWrap
                  sx={{
                    textOverflow: "ellipsis",
                    fontWeight: proctorField.fontWeight,
                  }}
                >
                  {proctorField.field}
                </Typography>
              ))}
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
