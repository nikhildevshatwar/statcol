import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { colors, sockets } from "../globals";
import * as Sockets from "../websocket";
import Generic from "./Generic";

const styles = {
  root: {
    minWidth: 100,
    color: colors.text,
    backgroundColor: colors.container,
    margin: 10,
  },
};

class DataCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      samplingInterval: this.props.socket.samplingInterval,
    };

    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.props.socket.updaters.push((parsedData) => {
      this.setState((state) => ({
        data: this.props.content(parsedData),
      }));
    });

    this.props.socket.closers.push((event) => {
      this.setState((state) => ({
        data: null,
      }));
    });
  }

  reset() {
    if (this.props.socket.handle !== null) {
      this.props.socket.handle.close();
    }

    this.props.socket.handle = Sockets.connectByType(
      this.props.socket.type,
      this.props.socket.address,
      this.props.socket.port
    );
  }

  render() {
    const { classes } = this.props;

    const content = (
      <Card className={classes.root}>
        <CardContent>{this.state.data}</CardContent>
      </Card>
    );

    return (
      <Generic
        innerComponent={content}
        resetHandler={this.reset}
        resetHandlerName={this.props.resetHandlerName}
        settings={{
          name: this.props.settingsName,
          configOptions: [
            {
              id: "samplingInterval",
              name: "Sampling Interval",
              defaultValue: sockets.getByType("memory").samplingInterval,
              update: (newValue) => {
                sockets.getByType("memory").samplingInterval = newValue;
              },
            },
          ],
        }}
      />
    );
  }
}

export default withStyles(styles)(DataCard);
