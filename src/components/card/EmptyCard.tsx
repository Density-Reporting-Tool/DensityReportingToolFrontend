import { Card, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

interface CardProps {
  children: string;
}

const EmptyCard: React.FC<CardProps> = ({ children }) => {
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
        {children}
      </Typography>
    </Card>
  );
};
export default EmptyCard;
