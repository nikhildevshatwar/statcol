import React from "react";
import TimeSeries from "./components/TimeSeries";
import { sockets } from "./globals";

function GPUSeries() {
  return (
    <TimeSeries
      socket={sockets.getByType("gpu")}
      seriesNames={["G1", "G2"]}
      title="GPU Load"
      yAxisTitle="Load"
      resetHandlerName="gpuReset"
      settingsName="GPU"
    />
  );
}

export default function GPUTab() {
  return (
    <React.Fragment>
      <GPUSeries />
    </React.Fragment>
  );
}
