import React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import PublishIcon from "@material-ui/icons/Publish";
import SettingsModal from "./SettingsModal";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Container from "@material-ui/core/Container";
import Tabs from "./Tabs";
import { colors, sockets } from "./globals";
import Visualization from "./Visualization";
import * as Sockets from "./websocket";

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
  publishButton: {
    marginLeft: 8,
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
      address: window.location.hostname,
      port: "",
      drawerOpen: true,
      tabSelected: "Linux",

      appData: {
        memData: {
          total: 0,
          free: 0,
          used: 0,
          buffCache: 0,
          shared: 0,
          available: 0,
        },
        swapData: { total: 0, free: 0, used: 0 },
        cpuData: {
          d: [],
          c1: [],
          c2: [],
          c3: [],
          c4: [],
        },
        tempData: {
          d: [],
          t1: [],
          t2: [],
          t3: [],
          t4: [],
          t5: [],
          t6: [],
          t7: [],
        },
        gpuData: {
          d: [],
          g1: [],
          g2: [],
        },
        uptime: "Invalid",
        load: {
          past1Min: 0.0,
          past5Min: 0.0,
          past15Min: 0.0,
        },
      },
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleIPAddressChange = this.handleIPAddressChange.bind(this);
    this.handlePortChange = this.handlePortChange.bind(this);
    this.sendIPAddress = this.sendIPAddress.bind(this);
    this.updateAppData = this.updateAppData.bind(this);
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

  handleIPAddressChange(event) {
    this.setState({ address: event.target.value });
  }

  handlePortChange(event) {
    this.setState({ port: event.target.value });
  }

  sendIPAddress() {
    if (sockets.memory !== null) {
      sockets.memory.close();
      this.updateAppData({
        memData: {
          total: 0,
          free: 0,
          used: 0,
          buffCache: 0,
          shared: 0,
          available: 0,
        },
        swapData: { total: 0, free: 0, used: 0 },
      });
    }
    sockets.memory = Sockets.connectToMemory(this);

    if (sockets.uptime !== null) {
      sockets.uptime.close();
      this.updateAppData({
        uptime: "Invalid",
      });
    }
    sockets.uptime = Sockets.connectToUptime(this);

    if (sockets.load !== null) {
      sockets.load.close();
      this.updateAppData({
        load: {
          past1Min: 0.0,
          past5Min: 0.0,
          past15Min: 0.0,
        },
      });
    }
    sockets.load = Sockets.connectToLoad(this);

    /*if (sockets.cpu !== null) {
                  sockets.cpu.close();
                  this.updateAppData({
                    cpuData: {
                      d: [],
                      c1: [],
                      c2: [],
                      c3: [],
                      c4: [],
                    },
                  });
                }*/
    sockets.cpu = Sockets.connectToCPU(this);

    if (sockets.temp !== null) {
      sockets.temp.close();
      this.updateAppData({
        tempData: {
          d: [],
          t1: [],
          t2: [],
          t3: [],
          t4: [],
          t5: [],
          t6: [],
          t7: [],
        },
      });
    }
    sockets.temp = Sockets.connectToTemp(this);

    if (sockets.gpu !== null) {
      sockets.gpu.close();
      this.updateAppData({
        gpuData: {
          d: [],
          g1: [],
          g2: [],
        },
      });
    }
    sockets.gpu = Sockets.connectToGPU(this);
  }

  updateAppData(data) {
    this.setState((state) => ({
      appData: { ...state.appData, ...data },
    }));
  }

  render() {
    const { classes } = this.props;

    return (
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
            <Typography className={classes.statusBar}>
              Load:&nbsp;
              <Tooltip title="1 Min">
                <div>{this.state.appData.load.past1Min} &nbsp;</div>
              </Tooltip>
              | &nbsp;
              <Tooltip title="5 Min">
                <div>{this.state.appData.load.past5Min} &nbsp;</div>
              </Tooltip>
              | &nbsp;
              <Tooltip title="15 Min">
                <div>{this.state.appData.load.past15Min} &nbsp;</div>
              </Tooltip>
              | &nbsp;
              <Tooltip title={this.state.appData.uptime}>
                <div>Active &nbsp;</div>
              </Tooltip>
            </Typography>
            <InputBase
              defaultValue={window.location.hostname}
              placeholder="Enter IP Address"
              onChange={this.handleIPAddressChange}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
            <InputBase
              placeholder="Enter Port Number"
              onChange={this.handlePortChange}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
            <IconButton
              edge="start"
              color="inherit"
              aria-label="send ip address"
              className={classes.publishButton}
              onClick={this.sendIPAddress}
            >
              <PublishIcon />
            </IconButton>
            <SettingsModal />
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
            <Visualization
              tabSelected={this.state.tabSelected}
              appData={this.state.appData}
              appRef={this}
            />
          </Container>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);
