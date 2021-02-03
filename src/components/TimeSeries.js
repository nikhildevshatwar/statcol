import { makeStyles } from "@material-ui/core/styles";
import { colors } from "../globals";
import Plot from "react-plotly.js";
import Generic from "./Generic";

const useStyles = makeStyles({
  root: {
    margin: 20,
    boxShadow: "0 2px 2px 0px",
  },
});

export default function TimeSeries(props) {
  const classes = useStyles();
  const content = (
    <Plot
      className={classes.root}
      data={props.data.map(({ name, xData, yData }) => ({
        name: name,
        x: xData,
        y: yData,
        type: "scatter",
        mode: "lines",
      }))}
      layout={{
        title: {
          text: props.title,
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
            text: props.xAxisTitle,
            color: colors.text,
          },
          automargin: true,
        },
        yaxis: {
          color: colors.text,
          title: { text: props.yAxisTitle, color: colors.text },
          automargin: true,
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

  return (
    <Generic
      innerComponent={content}
      resetHandler={props.resetHandler}
      resetHandlerName={props.resetHandlerName}
      settings={props.settings}
    />
  );
}
