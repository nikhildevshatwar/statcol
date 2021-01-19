import { makeStyles } from "@material-ui/core/styles";
import { colors } from "../globals";
import Plot from "react-plotly.js";

const useStyles = makeStyles({
  root: {
    margin: 20,
    boxShadow: "0 2px 2px 0px",
  },
});

export default function TimeSeries(props) {
  const classes = useStyles();

  return (
    <Plot
      className={classes.root}
      data={props.data.map(({ name, xData, yData }) => ({
        name: name,
        x: xData,
        y: yData,
        type: "scatter",
        mode: "lines+markers",
      }))}
      layout={{
        title: {
          text: props.title,
          font: {
            color: colors.text,
          },
        },
        legend: {
          x: 0,
          bgcolor: colors.container,
          borderwidth: 2,
          font: {
            color: colors.text,
          },
        },
        xaxis: {
          color: colors.text,
          title: {
            text: props.xAxisTitle,
            color: colors.text,
          },
        },
        yaxis: {
          color: colors.text,
          title: { text: props.yAxisTitle, color: colors.text },
        },
        margin: {
          pad: 30,
        },
        autosize: true,
        paper_bgcolor: colors.container,
        plot_bgcolor: colors.plot,
        uirevision: 1,
      }}
      config={{ displayLogo: false, scrollZoom: true }}
    />
  );
}
