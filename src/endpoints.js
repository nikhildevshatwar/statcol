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

function Tab(icon, text, endpoint, endpointSetter) {
  const classes = useStyles();

  return (
    <ListItem button>
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export default function Tab() {
  return (
    <React.Fragment>
      {Tab(<DashboardIcon />, "Linux", "linux")}
      {Tab(<ShoppingCartIcon />, "RAM", "ram")}
      {Tab(<PeopleIcon />, "Temperature", "temp")}
      {Tab(<BarChartIcon />, "Network Traffic", "net_traffic")}
    </React.Fragment>
  );
}
