import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactSpeedometer from "react-d3-speedometer";
import Generic from "./Generic";

const styles = {
  root: {
    margin: 5,
    boxShadow: "0 2px 2px 0px",
  },
};

class Meter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      samplingInterval: this.props.socket.args.samplingInterval,
    };
  }

  componentDidMount() {
    this.props.socket.updaters.push((parsedData) => {
      this.setState({ value: parsedData });
    });

    this.props.socket.closers.push((event) => {
      this.setState({ value: 0 });
    });
  }

  render() {
    const { classes } = this.props;

    const content = <ReactSpeedometer value={this.state.value} />;

    return (
      <Generic
        socket={this.props.socket}
        innerComponent={content}
        settings={{
          name: this.props.settingsName,
          configOptions: [
            {
              id: "samplingInterval",
              name: "Sampling interval",
              defaultValue: this.props.socket.args.samplingInterval,
              update: (newValue) => {
                this.props.socket.args.samplingInterval = newValue;
              },
            },
          ],
        }}
      />
    );
  }
}

export default withStyles(styles)(Meter);
