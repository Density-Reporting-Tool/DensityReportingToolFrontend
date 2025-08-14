import { IconButton, AppBar, Typography, Box } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSubtitleClick?: (text: string) => void;
}

const HeaderWithBackButton: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onSubtitleClick,
}) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
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
              mr: 1,
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
            <Typography variant="h6" sx={{ fontWeight: 400, color: "black" }}>
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
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    cursor: onSubtitleClick ? "pointer" : "default",
                    "&:hover": onSubtitleClick
                      ? { textDecoration: "underline" }
                      : {},
                  }}
                  onClick={() => onSubtitleClick && onSubtitleClick(subtitle)}
                >
                  {subtitle}
                </Typography>
                <LocationIcon color="action" sx={{ fontSize: "24px" }} />
              </Box>
            )}
          </Box>
        </Box>
      </AppBar>
    </>
  );
};

export default HeaderWithBackButton;
