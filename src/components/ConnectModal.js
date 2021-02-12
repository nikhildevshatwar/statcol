import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { colors, sockets } from "../globals";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import Button from "@material-ui/core/Button";
import * as Sockets from "../websocket";

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
  button: {
    margin: 5,
  },
  publishButton: {
    margin: 8,
  },
  textField: {
    color: "inherit",
  },
  label: {
    color: "inherit",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: colors.container,
    color: colors.text,
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ConnectModal(props) {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendIPAddress = (address, port) => {
    sockets.forEach((socket) => {
      if (socket.handle !== null) {
        socket.handle.close();
        socket.handle = null;
      }

      socket.handle = Sockets.connectByType(socket.type, address, port);
    });
    handleClose();
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Connect To Sockets</h2>
      <Typography id="discrete-slider" variant="h6" gutterBottom>
        {props.name}
      </Typography>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          const address = document.querySelector("#ipAddress").value;
          const port = document.querySelector("#port").value;

          sendIPAddress(address, port);
        }}
      >
        <TextField
          InputProps={{ className: classes.textField }}
          InputLabelProps={{ className: classes.label }}
          color="secondary"
          label="IP Address"
          id="ipAddress"
          defaultValue={window.location.hostname}
          variant="outlined"
        />
        <TextField
          InputProps={{ className: classes.textField }}
          InputLabelProps={{ className: classes.label }}
          color="secondary"
          label="Port"
          id="port"
          defaultValue={window.location.port}
          variant="outlined"
        />
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
        >
          Connect
        </Button>
      </form>
    </div>
  );

  return (
    <div>
      <IconButton
        id="connectModal"
        edge="start"
        color="inherit"
        aria-label="send ip address"
        className={classes.publishButton}
        onClick={handleOpen}
      >
        <SettingsBackupRestoreIcon />
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
