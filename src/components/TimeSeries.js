import React from "react";
import * as Sockets from "../websocket";
import { withStyles } from "@material-ui/core/styles";
import { colors, extractTimeString } from "../globals";
import Plot from "react-plotly.js";
import Generic from "./Generic";

const styles = {
  root: {
    margin: 20,
    boxShadow: "0 2px 2px 0px",
  },
};

class TimeSeries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.seriesNames.map((seriesName) => ({
        name: seriesName,
        x: [],
        y: [],
        type: "scatter",
        mode: "lines",
      })),
      samplingInterval: this.props.socket.samplingInterval,
      clockCycle: this.props.clockCycle || 1000,
    };

    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.props.socket.updaters.push((parsedData) => {
      const date = extractTimeString(new Date());
      this.setState((state) => ({
        data: state.data.map((seriesData, index) => ({
          ...seriesData,
          x: [...seriesData.x, date].splice(-this.state.clockCycle),
          y: [...seriesData.y, parsedData[index]].splice(
            -this.state.clockCycle
          ),
        })),
      }));
    });

    this.props.socket.closers.push((event) => {
      this.setState((state) => ({
        data: state.data.map((seriesData) => ({
          ...seriesData,
          x: [],
          y: [],
        })),
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
      <Plot
        className={classes.root}
        data={this.state.data}
        layout={{
          width: 400,
          height: 300,
          title: {
            text: this.props.title,
            font: {
              color: colors.text,
            },
          },
          legend: {
            bgcolor: colors.container,
            borderwidth: 2,
            font: {
              color: colors.text,
            },
          },
          xaxis: {
            visible: false,
            color: colors.text,
            title: {
              text: this.props.xAxisTitle,
              color: colors.text,
            },
            automargin: true,
          },
          yaxis: {
            color: colors.text,
            title: { text: this.props.yAxisTitle, color: colors.text },
            automargin: true,
          },
          margin: {
            pad: 30,
          },
          paper_bgcolor: colors.container,
          plot_bgcolor: colors.plot,
          uirevision: 1,
        }}
        config={{ displayLogo: false, scrollZoom: true }}
      />
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
              name: "Sampling interval",
              defaultValue: this.props.socket.samplingInterval,
              update: (newValue) => {
                this.props.socket.samplingInterval = newValue;
              },
            },
            {
              id: "clockCycle",
              name: "Clock Cycle",
              defaultValue: this.state.clockCycle,
              update: (newValue) => {
                this.setState({ clockCycle: newValue });
              },
            },
          ],
        }}
      />
    );
  }
}

export default withStyles(styles)(TimeSeries);
