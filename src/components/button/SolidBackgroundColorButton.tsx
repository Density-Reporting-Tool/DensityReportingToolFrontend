import { Button, Box } from "@mui/material";

interface ButtonProps {
  icon?: React.ReactElement;
  children: React.ReactNode;
  handleClick: (reportId?: string) => void;
  reportId?: string;
}

const SolidBackgroundColorButton: React.FC<ButtonProps> = ({
  icon,
  children,
  handleClick,
}) => {
  return (
    <Button
      variant="contained"
      disableElevation
      sx={{
        borderRadius: 10,
      }}
      onClick={() => {
        handleClick(reportId);
      }}
    >
      {icon}
      <Box component="span" sx={{ ml: 1 }}>
        {children}
      </Box>
    </Button>
  );
};
export default SolidBackgroundColorButton;
