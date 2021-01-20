import React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import PublishIcon from "@material-ui/icons/Publish";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Container from "@material-ui/core/Container";
import Tabs from "./Tabs";
import { colors } from "./globals";
import connectToWebSocket from "./websocket";
import Visualization from "./Visualization";
import { parseFreeCommand, parseCPU } from "./parsers";

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
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: window.location.hostname,
      port: "",
      drawerOpen: true,
      tabSelected: "default",
      config: {
        samplingInterval: 0.3,
        clockCycle: 25,
      },
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
      },
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(event) {
    this.setState({ tabSelected: event.target.innerText });
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
              onClick={() =>
                this.setState({
                  drawerOpen: true,
                })
              }
              className={clsx(
                classes.menuButton,
                this.state.drawerOpen && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Statistics Visualizer
            </Typography>
            <InputBase
              defaultValue={window.location.hostname}
              placeholder="Enter IP Address"
              onChange={(event) =>
                this.setState({ address: event.target.value })
              }
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
            <InputBase
              placeholder="Enter Port Number"
              onChange={(event) => this.setState({ port: event.target.value })}
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
              onClick={() => {
                this.setState({ tabSelected: "Linux" });
                connectToWebSocket(
                  this.state.address,
                  this.state.port,
                  "memory",
                  (event) => {
                    const parsedData = parseFreeCommand(event);
                    this.setState((state) => ({
                      appData: {
                        ...state.appData,
                        memData: parsedData.memData,
                        swapData: parsedData.swapData,
                      },
                    }));
                  },
                  { samplingInterval: this.state.config.samplingInterval }
                );
                connectToWebSocket(
                  this.state.address,
                  this.state.port,
                  "cpu",
                  (event) => {
                    const parsedData = parseCPU(event);
                    this.setState((state) => {
                      if (
                        state.appData.cpuData.d.length ===
                        state.config.clockCycle
                      ) {
                        return {
                          appData: {
                            ...state.appData,
                            cpuData: {
                              d: [
                                ...state.appData.cpuData.d,
                                new Date(),
                              ].splice(1),
                              c1: [
                                ...state.appData.cpuData.c1,
                                parsedData[0],
                              ].splice(1),
                              c2: [
                                ...state.appData.cpuData.c2,
                                parsedData[1],
                              ].splice(1),
                              c3: [
                                ...state.appData.cpuData.c3,
                                parsedData[2],
                              ].splice(1),
                              c4: [
                                ...state.appData.cpuData.c4,
                                parsedData[3],
                              ].splice(1),
                            },
                          },
                        };
                      }
                      return {
                        appData: {
                          ...state.appData,
                          cpuData: {
                            d: [...state.appData.cpuData.d, new Date()],
                            c1: [...state.appData.cpuData.c1, parsedData[0]],
                            c2: [...state.appData.cpuData.c2, parsedData[1]],
                            c3: [...state.appData.cpuData.c3, parsedData[2]],
                            c4: [...state.appData.cpuData.c4, parsedData[3]],
                          },
                        },
                      };
                    });
                  }
                );
              }}
            >
              <PublishIcon />
            </IconButton>
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
              onClick={() =>
                this.setState({
                  drawerOpen: false,
                })
              }
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
            />
          </Container>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);
