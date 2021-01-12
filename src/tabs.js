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

function Tab(classes, icon, text, endpoint) {
  return (
    <ListItem button onClick={(ev) => console.log(endpoint)}>
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export default function Tabs() {
  const classes = useStyles();

  return (
    <React.Fragment>
      {Tab(classes, <DashboardIcon />, "Linux", "linux")}
      {Tab(classes, <ShoppingCartIcon />, "RAM", "ram")}
      {Tab(classes, <PeopleIcon />, "Temperature", "temp")}
      {Tab(classes, <BarChartIcon />, "Network Traffic", "net_traffic")}
    </React.Fragment>
  );
}
