import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import { makeStyles } from "@material-ui/core/styles";
import { colors } from "./globals";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: colors.text,
    margin: 5,
  },
}));

function Tab(classes, icon, text, endpoint, endpointSetter) {
  return (
    <ListItem button onClick={() => endpointSetter(endpoint)}>
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export default function Tabs(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {Tab(classes, <DashboardIcon />, "Linux", "linux", props.endpointSetter)}
      {Tab(classes, <ShoppingCartIcon />, "RAM", "ram", props.endpointSetter)}
      {Tab(
        classes,
        <PeopleIcon />,
        "Temperature",
        "temp",
        props.endpointSetter
      )}
      {Tab(
        classes,
        <BarChartIcon />,
        "Network Traffic",
        "net_traffic",
        props.endpointSetter
      )}
    </React.Fragment>
  );
}
