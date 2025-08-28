import { IconButton, AppBar, Typography, Box } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  // LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSubtitleClick?: () => void;
}

const HeaderWithBackButton: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onSubtitleClick,
}) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
          minHeight: "100px",
        }}
      >
        <Box sx={{ display: "flex", pt: 5 }}>
          <IconButton
            onClick={handleBack}
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "1.25rem" }} />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mb: 1,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 400, color: "black" }}>
              {title}
            </Typography>
            {subtitle && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    cursor: onSubtitleClick ? "pointer" : "default",
                    "&:hover": onSubtitleClick
                      ? { textDecoration: "underline" }
                      : {},
                  }}
                  onClick={() => onSubtitleClick && onSubtitleClick()}
                >
                  {subtitle}
                </Typography>
                {/* <LocationIcon color="action" sx={{ fontSize: "24px" }} /> */}
              </Box>
            )}
          </Box>
        </Box>
      </AppBar>
    </>
  );
};

export default HeaderWithBackButton;
