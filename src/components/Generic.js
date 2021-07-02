import React from "react";
import IconButton from "@material-ui/core/IconButton";
import RedoIcon from "@material-ui/icons/Redo";
import { makeStyles } from "@material-ui/core/styles";
import SettingsModal from "./SettingsModal";
import ToolTip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    margin: 0,
    padding: 0,
  },
  buttonGroup: {
    display: "flex",
    margin: 0,
    padding: 0,
  },
  button: {
    margin: 0,
    padding: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
}));

export default function Generic(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.buttonGroup}>
        <ToolTip title="Reset">
          <IconButton
            id={`${props.socket.type}Reset`}
            edge="start"
            color="secondary"
            aria-label="reset"
            className={classes.button}
            onClick={() => {
              if (props.resetHandler !== undefined) {
                props.resetHandler();
              } else {
                props.socket.connect();
              }
            }}
          >
            <RedoIcon />
          </IconButton>
        </ToolTip>
        <SettingsModal
          className={classes.button}
          name={props.settings.name || "Settings"}
          configOptions={props.settings.configOptions}
          onSettingsClose={() => {
            document.querySelector(`#${props.socket.type}Reset`).click();
          }}
        />
      </div>
      {props.innerComponent}
    </div>
  );
}
