import { Box, Card, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

interface CardProps {
  text: string;
  handleClick?: () => void;
}

const EmptyCard: React.FC<CardProps> = ({ text, handleClick }) => (
  <Card
    sx={{
      padding: 2,
      borderRadius: 2,
      backgroundColor: grey[300],
      display: "flex",
      justifyContent: "center",
      boxShadow: "none",
    }}
    onClick={handleClick}
  >
    <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
      <Box>
        <Typography variant="body1">{text}</Typography>
      </Box>
    </Stack>
  </Card>
);
export default EmptyCard;
