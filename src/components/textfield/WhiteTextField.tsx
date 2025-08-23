import { Typography, Box, TextField, InputAdornment } from "@mui/material";

interface TextFieldProp {
  label: string;
  value: string;
  fullWidth?: boolean;
  units?: string;
}
const WhiteTextField: React.FC<TextFieldProp> = ({
  label,
  value,
  fullWidth = true,
  units,
}) => {
  return (
    <>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <TextField
          fullWidth={fullWidth}
          value={value}
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              borderRadius: 2,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{units}</InputAdornment>
            ),
          }}
        />
      </Box>
    </>
  );
};
export default WhiteTextField;
