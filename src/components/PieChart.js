import React from "react";
import * as Sockets from "../websocket";
import { withStyles } from "@material-ui/core/styles";
import { colors } from "../globals";
import React from "react";
import Plot from "react-plotly.js";
import Generic from "./Generic";

const styles = {
  root: {
    margin: 20,
    boxShadow: "0 2px 2px 0px",
  },
};

class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.size = Math.ceil(Math.sqrt(this.props.socketObjs.length));
    this.state = {
      data: this.props.labelSets.map((labelSet, labelIndex) => {
        const values = new Array(labelSet.length);
        values.fill(0);

        return {
          name: this.props.titles[labelIndex],
          values: values,
          labels: labelSet,
          type: "pie",
          domain: {
            row: Math.floor(labelIndex / this.size),
            column: Math.floor(labelIndex % this.size),
          },
        };
      }),
    };

    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.props.socketObjs.forEach((socketObj, socketIndex) =>
      socketObj.socket.updaters.push((parsedData) => {
        this.setState((state) => ({
          data: [
            ...state.data.slice(0, socketIndex),
            {
              ...state.data[socketIndex],
              values: socketObj.parser(parsedData),
            },
            ...state.data.slice(socketIndex + 1),
          ],
        }));
      })
    );

    this.props.socketObjs.forEach((socketObj, socketIndex) =>
      socketObj.socket.closers.push((event) => {
        this.setState((state) => ({
          data: [
            ...state.data.slice(0, socketIndex),
            {
              ...state.data[socketIndex],
              values: [],
            },
            ...state.data.slice(socketIndex + 1),
          ],
        }));
      })
    );
  }

  reset() {
    this.props.socketObjs.forEach((socketObj) => {
      if (socketObj.socket.handle !== null) {
        socketObj.socket.handle.close();
      }

      socketObj.socket.handle = Sockets.connectByType(
        socketObj.socket.type,
        socketObj.socket.address,
        socketObj.socket.port
      );
    });
  }

  render() {
    const { classes } = this.props;

    const content = (
      <Plot
        className={classes.root}
        data={this.state.data}
        layout={{
          grid: { rows: this.size, columns: this.size },
          showlegend: false,
          font: { color: colors.text },
          margin: {
            pad: 30,
          },
          autosize: true,
          paper_bgcolor: colors.container,
          plot_bgcolor: colors.plot,
          uirevision: 1,
        }}
      ></Plot>
    );

    return (
      <Generic
        innerComponent={content}
        resetHandler={this.reset}
        resetHandlerName={this.props.resetHandlerName}
        settings={{
          name: this.props.settingsName,
          configOptions: this.props.socketObjs.map((socketObj) => {
            return {
              id: `${socketObj.socket.type}samplingInterval`,
              name: `Sampling Interval: ${socketObj.socket.type}`,
              defaultValue: socketObj.socket.samplingInterval,
              update: (newValue) => {
                socketObj.socket.samplingInterval = newValue;
              },
            };
          }),
        }}
      />
    );
  }
}

export default withStyles(styles)(PieChart);
