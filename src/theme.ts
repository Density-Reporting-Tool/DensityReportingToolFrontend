import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
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
  },
  typography: {
    fontFamily: "'Roboto', sans-serif", // change if you want a different font
    h1: {
      fontSize: "3rem", // 48px
      fontWeight: 700,
    },
    h2: {
      fontSize: "2.5rem", // 40px
      fontWeight: 600,
    },
    h3: {
      fontSize: "2rem", // 32px
      fontWeight: 500,
    },
    body1: {
      fontSize: "0.8rem", // 16px
    },
    body2: {
      fontSize: "0.875rem", // 14px
    },
    caption: {
      fontSize: "0.75rem", // 12px
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
