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

function Tab({ icon, text, onClick }) {
  const classes = useStyles();

  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export default function Tabs(props) {
  return (
    <React.Fragment>
      <Tab icon={<DashboardIcon />} text="Edge AI" onClick={props.updateTab} />
      <Tab icon={<ShoppingCartIcon />} text="Demo Test" onClick={props.updateTab} />
    </React.Fragment>
  );
}
