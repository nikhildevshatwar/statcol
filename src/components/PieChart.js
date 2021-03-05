import React from "react";
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
      socketObj.socket.connect();
    });
  }

  render() {
    const { classes } = this.props;

    const content = (
      <Plot
        className={classes.root}
        data={this.state.data}
        layout={{
          height: 450,
          margin: { l: 50, r: 50, b: 50, t: 50 },
          grid: {
            rows: this.props.socketObjs.length / this.size,
            columns: this.size,
          },
          showlegend: false,
          font: { color: colors.text },
          paper_bgcolor: colors.container,
          plot_bgcolor: colors.plot,
          uirevision: 1,
        }}
      ></Plot>
    );

    return (
      <Generic
        socket={this.props.socketObjs[0]}
        innerComponent={content}
        resetHandler={this.reset}
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
