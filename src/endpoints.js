import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import { makeStyles } from "@material-ui/core/styles";
import { colors } from "./globals";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: colors.text,
    margin: 5,
  },
}));

function Endpoint(classes, icon, text, endpoint, endpointSetter) {
  return (
    <ListItem button onClick={() => endpointSetter(endpoint)}>
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export default function Endpoints(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {Endpoint(
        classes,
        <DashboardIcon />,
        "Linux",
        "linux",
        props.endpointSetter
      )}
      {Endpoint(
        classes,
        <ShoppingCartIcon />,
        "RAM",
        "ram",
        props.endpointSetter
      )}
      {Endpoint(
        classes,
        <PeopleIcon />,
        "Temperature",
        "temp",
        props.endpointSetter
      )}
      {Endpoint(
        classes,
        <BarChartIcon />,
        "Network Traffic",
        "net_traffic",
        props.endpointSetter
      )}
    </React.Fragment>
  );
}
