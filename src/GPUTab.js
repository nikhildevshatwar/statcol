import React from "react";
import TimeSeries from "./components/TimeSeries";
import { sockets } from "./globals";
import * as Sockets from "./websocket";

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
      resetHandler={() => {
        sockets.gpu.close();
        props.appRef.updateAppData({
          gpuData: {
            d: [],
            g1: [],
            g2: [],
          },
        });
        sockets.gpu = Sockets.connectToGPU(props.appRef);
      }}
      resetHandlerName="gpuReset"
    />
  );
}

export default function GPUTab({ ...props }) {
  return (
    <React.Fragment>
      <GPUSeries {...props} />
    </React.Fragment>
  );
}
