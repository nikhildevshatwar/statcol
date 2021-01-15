import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { colors } from "../globals";

const useStyles = makeStyles({
  root: {
    minWidth: 100,
    maxWidth: 215,
    color: colors.text,
    backgroundColor: colors.container,
  },
});

export default function DataCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>{props.data}</CardContent>
    </Card>
  );
}
