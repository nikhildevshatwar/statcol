import React from "react";
import TimeSeries from "./components/TimeSeries";
import { sockets, config } from "./globals";
import * as Sockets from "./websocket";

function GPUSeries(props) {
  function reset() {
    if (sockets.gpu === null) {
      return;
    }

    sockets.gpu.close();
    props.appRef.updateAppData({
      gpuData: {
        d: [],
        g1: [],
        g2: [],
      },
    });
    sockets.gpu = Sockets.connectToGPU(props.appRef);
  }

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
      resetHandler={reset}
      resetHandlerName="gpuReset"
      settings={{
        name: "GPU",
        configOptions: [
          {
            id: "samplingInterval",
            name: "Sampling Interval",
            defaultValue: config.getByType("gpu").samplingInterval,
            update: (newValue) => {
              config.getByType("gpu").samplingInterval = newValue;
            },
          },
          {
            id: "clockCycle",
            name: "Clock Cycle",
            defaultValue: config.getByType("gpu").clockCycle,
            update: (newValue) => {
              config.getByType("gpu").clockCycle = parseInt(newValue);
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
