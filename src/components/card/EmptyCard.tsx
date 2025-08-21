import { Card, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

const EmptyCard = () => {
  return (
    <Card
      sx={{
        padding: 2,
        borderRadius: 2,
        backgroundColor: grey[300],
        display: "flex",
        justifyContent: "center",
        boxShadow: "none",
      }}
    >
      <Typography variant="body1" color={grey[600]}>
        No density test yet
      </Typography>
    </Card>
  );
};
export default EmptyCard;
