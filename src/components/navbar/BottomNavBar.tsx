import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HomeIcon from "@mui/icons-material/Home";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const BottomNavBar = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/field-tech-dashboard":
        setCurrentPage(0);
        break;
      case "/all-reports":
        setCurrentPage(1);
        break;
      case "/take-photo":
        setCurrentPage(2);
        break;
      case "/add-density-tests":
        setCurrentPage(3);
        break;
      default:
        setCurrentPage(0); // Default to home if path doesn't match
    }
  }, [location.pathname]);

  const handleChangePage = (_event: React.SyntheticEvent, newPage: number) => {
    setCurrentPage(newPage);
    switch (newPage) {
      case 0:
        navigate("/field-tech-dashboard");
        break;
      case 1:
        navigate("/all-reports");
        break;
      case 2:
        navigate("/take-photo");
        break;
      case 3:
        navigate("/add-density-tests");
        break;
      default:
        navigate("/field-tech-dashboard");
    }
  };
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={currentPage}
        onChange={handleChangePage}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction
          label="Reports"
          icon={<FormatListBulletedIcon />}
        />
        <BottomNavigationAction label="Take Photo" icon={<CameraAltIcon />} />
        <BottomNavigationAction label="Density Shot" icon={<AddIcon />} />
      </BottomNavigation>
    </Paper>
  );
};
export default BottomNavBar;
