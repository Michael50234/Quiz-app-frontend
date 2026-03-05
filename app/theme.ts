import { createTheme } from "@mui/material";


export const theme = createTheme({
    palette: {
        primary: {
            main: "hsl(219, 59%, 73%)",
        },
        secondary: {
            main: "hsl(39, 59%, 73%)",
        },
        error: {
            main: "hsl(0, 75%, 63%)",
        },
        warning: {
            main: "hsl(36, 85%, 67%)",
        },
        success: {
            main: "hsl(120, 66%, 62%)",
        },
        info: {
            main: "hsl(246, 83%, 75%)",
        },
    },
    typography: {
        fontFamily: "Poppins, sans-serif",
    },

    components: {
        MuiTypography: {
            defaultProps: {
                color: "var(--text)"
            }
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    color: "black"
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiFormLabel-root": {
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        top: "5px"
                    },
                    "& .MuiInputBase-root": {
                        fontSize: "1.3rem",
                    }
                },
            },
        },
    },


})