import React, { useEffect } from "react";
import clsx from "clsx";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Container from "@material-ui/core/Container";
import Tabs from "./Tabs";
import { colors } from "./globals";
import Visualization from "./Visualization";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css/animate.min.css";
import AlbumIcon from "@material-ui/icons/Album";
import ConnectModal from "./components/ConnectModal";
import { Sockets } from "./websocket";

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
    backgroundColor: colors.background,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: colors.appBar,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  settingsButton: {
    marginLeft: 8,
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    backgroundColor: colors.container,
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  drawerButton: {
    color: colors.text,
  },
  inputRoot: {
    backgroundColor: colors.input,
    color: colors.text,
    borderRadius: "5ch",
    margin: 5,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  tabList: {
    color: colors.text,
  },
  statusBar: {
    display: "flex",
    backgroundColor: colors.input,
    color: colors.text,
    borderRadius: "5ch",
    margin: 5,
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: "100%",
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: true,
      tabSelected: "Edge AI",
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  handleTabChange(event) {
    this.setState({ tabSelected: event.target.innerText });
  }

  handleDrawerOpen(event) {
    this.setState({ drawerOpen: true });
  }

  handleDrawerClose(event) {
    this.setState({ drawerOpen: false });
  }

  componentDidMount() {
    document.querySelector("#connectModal").click();
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <ReactNotification />
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="absolute"
            className={clsx(
              classes.appBar,
              this.state.drawerOpen && classes.appBarShift
            )}
          >
            <Toolbar className={classes.toolbar}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={clsx(
                  classes.menuButton,
                  this.state.drawerOpen && classes.menuButtonHidden
                )}
              >
                <MenuIcon />
              </IconButton>
              <StatusBar />
              <ConnectModal />
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(
                classes.drawerPaper,
                !this.state.drawerOpen && classes.drawerPaperClose
              ),
            }}
            open={this.state.drawerOpen}
          >
            <div className={classes.toolbarIcon}>
              <IconButton
                onClick={this.handleDrawerClose}
                className={classes.drawerButton}
              >
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <List className={classes.tabList}>
              <Tabs updateTab={this.handleTabChange} />
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Visualization tabSelected={this.state.tabSelected} />
            </Container>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

function StatusBar(props) {
  const classes = makeStyles(styles)();

  const [uptime, setUptime] = React.useState("Invalid");
  const [loadData, setLoadData] = React.useState({
    past1Min: 0.0,
    past5Min: 0.0,
    past15Min: 0.0,
  });
  const [deadAlive, setDeadAlive] = React.useState(false);

  useEffect(() => {
    const uptimeSocket = Sockets.getByType("uptime");
    const loadSocket = Sockets.getByType("load");
    const deadAliveSocket = Sockets.getByType("dead_alive");

    uptimeSocket.updaters.push((parsedData) => {
      setUptime(parsedData);
    });
    uptimeSocket.closers.push((event) => {
      setUptime("Invalid");
    });

    loadSocket.updaters.push((parsedData) => {
      setLoadData(parsedData);
    });
    loadSocket.closers.push((event) => {
      setLoadData({
        past1Min: 0.0,
        past5Min: 0.0,
        past15Min: 0.0,
      });
    });
    deadAliveSocket.updaters.push((parsedData) => {
      setDeadAlive(parsedData);
    });
    deadAliveSocket.closers.push((event) => {
      setDeadAlive(false);
    });
  }, []);

  return (
    <React.Fragment>
      <Typography className={classes.statusBar}>
        Load:&nbsp;
        <Tooltip title="1 Min">
          <div>{loadData.past1Min} &nbsp;</div>
        </Tooltip>
        | &nbsp;
        <Tooltip title="5 Min">
          <div>{loadData.past5Min} &nbsp;</div>
        </Tooltip>
        | &nbsp;
        <Tooltip title="15 Min">
          <div>{loadData.past15Min} &nbsp;</div>
        </Tooltip>
        | &nbsp;
        <Tooltip title="Uptime">
          <div>{uptime} &nbsp;</div>
        </Tooltip>
        <Tooltip title={`Component: ${deadAlive ? "Alive" : "Dead"}`}>
          <AlbumIcon color={deadAlive ? undefined : "disabled"} />
        </Tooltip>
      </Typography>
    </React.Fragment>
  );
}

export default withStyles(styles)(App);
