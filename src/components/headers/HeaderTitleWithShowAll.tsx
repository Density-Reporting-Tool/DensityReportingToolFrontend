import { Box, Typography } from "@mui/material";

interface HeaderProp {
  title: string;
}

const HeaderTitleWithShowAll: React.FC<HeaderProp> = ({ title }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <Typography
          variant="body2"
          color="primary.main"
          sx={{
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Show all
        </Typography>
      </Box>
    </>
  );
};
export default HeaderTitleWithShowAll;
