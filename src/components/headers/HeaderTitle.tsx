import { Box, Typography } from "@mui/material";

interface HeaderProp {
  title: string;
  showAll?: boolean;
  onClick?: () => void;
}

const HeaderTitle: React.FC<HeaderProp> = ({
  title,
  showAll = false,
  onClick,
}) => {
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
        {showAll && (
          <Typography
            variant="body2"
            color="primary.main"
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={onClick}
          >
            Show all
          </Typography>
        )}
      </Box>
    </>
  );
};
export default HeaderTitle;
