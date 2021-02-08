import React, { useEffect } from "react";
import TimeSeries from "./components/TimeSeries";
import { sockets, config, extractTimeString } from "./globals";
import * as Sockets from "./websocket";

function GPUSeries(props) {
  const [gpuData, setGPUData] = React.useState({
    d: [],
    g1: [],
    g2: [],
  });

  useEffect(() => {
    const clockCycle = config.getByType("gpu").clockCycle;

    sockets.getByType("gpu").updaters.push((parsedData) => {
      setGPUData((gpuData) => ({
        d: [...gpuData.d, extractTimeString(new Date())].splice(-clockCycle),
        g1: [...gpuData.g1, parsedData[0]].splice(-clockCycle),
        g2: [...gpuData.g2, parsedData[1]].splice(-clockCycle),
      }));
    });
    sockets.getByType("gpu").closers.push((event) => {
      setGPUData({
        d: [],
        g1: [],
        g2: [],
      });
    });
  }, [config.getByType("gpu").clockCycle]);

  function reset() {
    if (sockets.getByType("gpu").handle !== null) {
      sockets.getByType("gpu").handle.close();
    }

    sockets.getByType("gpu").handle = Sockets.connectToGPU(props.appRef);
  }

  return (
    <TimeSeries
      data={[
        {
          name: "G1",
          xData: gpuData.d,
          yData: gpuData.g1,
        },
        {
          name: "G2",
          xData: gpuData.d,
          yData: gpuData.g2,
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
