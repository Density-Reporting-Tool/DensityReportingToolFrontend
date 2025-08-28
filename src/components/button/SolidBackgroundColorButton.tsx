import { Button, Stack } from "@mui/material";

interface ButtonProps {
  icon?: React.ReactElement;
  children: React.ReactNode;
  handleClick: () => void;
}

const SolidBackgroundColorButton: React.FC<ButtonProps> = ({
  icon,
  children,
  handleClick,
}) => {
  return (
    <Button
      size="medium"
      variant="contained"
      sx={{
        borderRadius: 5,
      }}
      onClick={handleClick}
    >
      <Stack gap={1} direction="row">
        {icon} {children}
      </Stack>
    </Button>
  );
};
export default SolidBackgroundColorButton;
