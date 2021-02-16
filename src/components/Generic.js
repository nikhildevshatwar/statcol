import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SettingsModal from "./SettingsModal";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    margin: 5,
  },
}));

export default function Generic(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.innerComponent}
      <div className={classes.buttonGroup}>
        <Button
          id={props.resetHandlerName}
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => {
            if (this.props.resetHandler === null) {
              this.props.socket.connect();
            } else {
              this.props.resetHandler();
            }
          }}
        >
          Reset
        </Button>
        <SettingsModal
          className={classes.button}
          name={props.settings.name}
          configOptions={props.settings.configOptions}
          onSettingsClose={() => {
            document.querySelector(`#${props.resetHandlerName}`).click();
          }}
        />
      </div>
    </div>
  );
}
