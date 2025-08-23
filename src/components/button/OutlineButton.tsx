import { Button, Stack } from "@mui/material";

interface ButtonProps {
  icon?: React.ReactElement;
  children: React.ReactNode;
  handleClick: () => void;
}

const OutlinedButton: React.FC<ButtonProps> = ({
  icon,
  children,
  handleClick,
}) => {
  return (
    <Button
      variant="outlined"
      disableElevation
      sx={{
        borderRadius: 10,
      }}
      onClick={handleClick}
    >
      <Stack gap={1} direction="row">
        {icon} {children}
      </Stack>
    </Button>
  );
};
export default OutlinedButton;
