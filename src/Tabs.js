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

function Tab(icon, text) {
  const classes = useStyles();

  return (
    <ListItem button>
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export default function Tabs() {
  return (
    <React.Fragment>
      {Tab(<DashboardIcon />, "Linux")}
      {Tab(<ShoppingCartIcon />, "RAM")}
      {Tab(<PeopleIcon />, "Temperature")}
      {Tab(<BarChartIcon />, "Network Traffic")}
    </React.Fragment>
  );
}
