import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#346598",
    },
    secondary: {
      main: "#173d63", // customize secondary color
    },
    error: {
      main: "#d70214ff",
    },
    background: {
      default: "#f4f6f8",
    },
    success: {
      main: "#228808",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: {
      fontSize: "2.625rem", // 42px
      fontWeight: 700,
    },
    h2: {
      fontSize: "2.25rem", // 36px
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.875rem", // 30px
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.5rem", // 24px
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.25rem", // 20px
      fontWeight: 500,
    },
    h6: {
      fontSize: "1.125rem", // 18px
      fontWeight: 400,
    },
    body1: {
      fontSize: "1rem", // 16px
    },
    body2: {
      fontSize: "0.875rem", // 14px
    },
    caption: {
      fontSize: "0.75rem", // 12px
    },
  },
});

export default theme;
