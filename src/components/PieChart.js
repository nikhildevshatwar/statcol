import { makeStyles } from "@material-ui/core/styles";
import { colors } from "../globals";
import React from "react";
import Plot from "react-plotly.js";
import Generic from "./Generic";

const useStyles = makeStyles({
  root: {
    margin: 20,
    boxShadow: "0 2px 2px 0px",
  },
});

export default function PieChart(props) {
  const classes = useStyles();
  const content = (
    <Plot
      className={classes.root}
      data={props.data.map(({ name, values, labels }) => ({
        name: name,
        values: values,
        labels: labels,
        type: "pie",
      }))}
      layout={{
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
      resetHandler={props.resetHandler}
      resetHandlerName={props.resetHandlerName}
      settings={props.settings}
    />
  );
}
