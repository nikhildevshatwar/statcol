import React from "react";
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
      data: [],
      samplingInterval: this.props.socket.args.samplingInterval,
      clockCycle: this.props.clockCycle || 1000,
    };
  }

  componentDidMount() {
    this.props.socket.updaters.push((parsedData) => {
      const date = extractTimeString(new Date());
      const seriesNames = parsedData[0];
      const data = parsedData[1];

      this.setState((state) => ({
        data:
          state.data.length === 0
            ? seriesNames.map((seriesName, index) => ({
                name: seriesName,
                x: [date],
                y: [data[index]],
                type: "scatter",
                mode: "lines",
              }))
            : state.data.map((seriesData, index) => ({
                ...seriesData,
                x: [...seriesData.x, date].splice(-this.state.clockCycle),
                y: [...seriesData.y, data[index]].splice(
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
