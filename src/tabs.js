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

export default function Tabs() {
  const classes = useStyles();

  return (
    <div>
      <ListItem button>
        <ListItemIcon className={classes.icon}>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Linux" />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.icon}>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="RAM" />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.icon}>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Temperature" />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.icon}>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Network Traffic" />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.icon}>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Interrupts" />
      </ListItem>
    </div>
  );
}
