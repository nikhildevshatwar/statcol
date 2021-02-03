import React from "react";
import TimeSeries from "./components/TimeSeries";
import { sockets, config } from "./globals";
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
      settings={{
        name: "GPU",
        configOptions: [
          {
            name: "Sampling Interval",
            defaultValue: config.getByType("gpu").samplingInterval,
            onChange: (event) => {
              config.getByType("gpu").samplingInterval = parseFloat(
                event.target.value
              );
            },
          },
          {
            name: "Clock Cycle",
            defaultValue: config.getByType("gpu").clockCycle,
            onChange: (event) => {
              config.getByType("gpu").clockCycle = parseInt(event.target.value);
            },
          },
        ],
      }}
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
