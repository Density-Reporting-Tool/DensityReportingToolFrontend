import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HomeIcon from "@mui/icons-material/Home";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
const BottomNavBar = () => {
  const { jobId, reportId } = useParams<{ jobId: string; reportId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPage = () => {
    if (location.pathname.startsWith("/field-tech/job") && jobId && reportId)
      return 1;
    if (location.pathname === "/field-tech") return 0;
    if (location.pathname === "/field-tech/add-density-test") return 3;
    if (location.pathname === "/take-photo") return 2;
    return 0;
  };

  const [currentPage, setCurrentPage] = React.useState(getCurrentPage());

  // Keep currentPage in sync when URL changes
  useEffect(() => {
    setCurrentPage(getCurrentPage());
  }, [location.pathname, jobId, reportId]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentPage(newValue);
    switch (newValue) {
      case 0:
        navigate("/field-tech");
        break;
      case 1:
        if (jobId && reportId)
          navigate(`/field-tech/job/${jobId}/report/${reportId}`);
        break;
      case 2:
        // TODO
        // navigate("/take-photo");
        console.log("Take photo page");
        break;
      case 3:
        navigate("/field-tech/add-density-test");
        break;
      default:
        navigate("/field-tech");
    }
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels value={currentPage} onChange={handleChange}>
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
