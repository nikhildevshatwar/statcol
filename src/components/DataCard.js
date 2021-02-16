import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { colors } from "../globals";
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

  render() {
    const { classes } = this.props;

    const content = (
      <Card className={classes.root}>
        <CardContent>{this.state.data}</CardContent>
      </Card>
    );

    return (
      <Generic
        socket={this.props.socket}
        innerComponent={content}
        resetHandlerName={this.props.resetHandlerName}
        settings={{
          name: this.props.settingsName,
          configOptions: [
            {
              id: "samplingInterval",
              name: "Sampling Interval",
              defaultValue: this.props.socket.samplingInterval,
              update: (newValue) => {
                this.props.socket.samplingInterval = newValue;
              },
            },
          ],
        }}
      />
    );
  }
}

export default withStyles(styles)(DataCard);
