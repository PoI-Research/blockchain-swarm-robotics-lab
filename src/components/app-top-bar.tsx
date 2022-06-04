import { ReactElement, useContext } from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { ThemeContext } from "../theme";

export const AppTopBar = (): ReactElement => {
    const [ mode, toggleMode ] = useContext(ThemeContext);
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={ { padding: "1em 0 1em 0", flexGrow: 1 } }>
                    Blockchain Swarm Robotics Lab
                </Typography>
                <IconButton onClick={ toggleMode }>
                    { mode === "light" ? <DarkMode /> : <LightMode /> }
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
