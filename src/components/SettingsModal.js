import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { colors } from "../globals";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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

function validateInputValue(valueString) {
  const parsedInput = parseFloat(valueString);

  if (parsedInput !== "NaN" && parsedInput > 0.0) {
    return parsedInput;
  }

  return null;
}

export default function SettingsModal(props) {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.onSettingsClose();
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Settings</h2>
      <Typography id="discrete-slider" variant="h6" gutterBottom>
        {props.name}
      </Typography>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          props.configOptions.forEach((configOption) => {
            const parsedInput = validateInputValue(
              document.querySelector(`#${configOption.id}`).value
            );

            if (parsedInput !== null) {
              configOption.update(parsedInput);
            } else {
              console.log("Invalid Input"); // TODO: Replace with Alert
            }
          });
        }}
      >
        {props.configOptions.map((configOption) => {
          return (
            <React.Fragment>
              <TextField
                InputProps={{ className: classes.textField }}
                InputLabelProps={{
                  className: classes.label,
                }}
                color="secondary"
                id={configOption.id}
                label={configOption.name}
                defaultValue={configOption.defaultValue}
                variant="outlined"
              />
            </React.Fragment>
          );
        })}
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );

  return (
    <div>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Settings
      </Button>
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
