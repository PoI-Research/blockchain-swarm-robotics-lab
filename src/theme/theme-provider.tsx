import { createTheme, PaletteMode, useMediaQuery } from "@mui/material";
import { red } from "@mui/material/colors";
import { ThemeProvider } from "@mui/system";
import React, { useEffect } from "react";
import { PropsWithChildren, ReactElement, useMemo, useState } from "react";

export const ThemeContext = React.createContext<[ mode: PaletteMode, toggleMode: () => void ]>([ "light", () => { } ]);

export const AppThemeProvider = (props: PropsWithChildren<any>): ReactElement => {
    const { children } = props;

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const [ mode, setMode ] = useState<PaletteMode>("light");

    useEffect(() => {
        setMode(prefersDarkMode ? "dark" : "light");
    }, [ prefersDarkMode ]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode,
                    primary: {
                        main: red[900]
                    }
                }
            }),
        [ mode ]
    );

    const toggleMode = (): void => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={ [ mode, toggleMode ] }>
            <ThemeProvider theme={ theme }>{ children }</ThemeProvider>
        </ThemeContext.Provider>
    );
};
