import React from "react";
import TimeSeries from "./components/TimeSeries";

function GPUSeries(props) {
  return (
    <TimeSeries
      data={[
        {
          name: "G1",
          xData: props.appData.gpuData.d,
          yData: props.appData.gpuData.g1,
        },
        {
          name: "G2",
          xData: props.appData.gpuData.d,
          yData: props.appData.gpuData.g2,
        },
      ]}
      title="GPU Load"
      xAxisTitle="Time"
      yAxisTitle="Load"
    />
  );
}

export default function GPUTab(props) {
  return (
    <React.Fragment>
      <GPUSeries appData={props.appData} />
    </React.Fragment>
  );
}
