import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { colors, config } from "./globals";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: colors.container,
    color: colors.text,
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SettingsModal() {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    document.querySelector("#tempReset").click();
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Settings</h2>
      <Typography id="discrete-slider" gutterBottom>
        Temperature
      </Typography>
      <Slider
        defaultValue={config.samplingInterval.temp}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={0.1}
        min={0.1}
        max={10}
        onChange={(event) => {
          config.samplingInterval.temp = parseFloat(event.target.textContent);
        }}
      />
    </div>
  );

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        className={classes.settingsButton}
        onClick={handleOpen}
      >
        <SettingsIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
