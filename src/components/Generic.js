import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SettingsModal from "./SettingsModal";

const useStyles = makeStyles((theme) => ({
  buttons: {
    margin: 5,
  },
}));

export default function Generic(props) {
  const classes = useStyles();

  return (
    <div>
      {props.innerComponent}
      <Button
        id={props.resetHandlerName}
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={props.resetHandler}
      >
        Reset
      </Button>
      <SettingsModal
        name={props.settings.name}
        configOptions={props.settings.configOptions}
        onSettingsClose={() => {
          document.querySelector(`#${props.resetHandlerName}`).click();
        }}
      />
    </div>
  );
}
