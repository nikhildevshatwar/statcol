import Button from "@material-ui/core/Button";

export default function Generic(props) {
  return (
    <div>
      {props.innerComponent}
      <Button
        id={props.resetHandlerName}
        variant="contained"
        color="primary"
        onClick={props.resetHandler}
      >
        Reset
      </Button>
    </div>
  );
}
