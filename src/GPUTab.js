import React from "react";
import TimeSeries from "./components/TimeSeries";
import { Sockets } from "./websocket";

function GPUSeries() {
  return (
    <TimeSeries
      socket={Sockets.getByType("gpu")}
      seriesNames={["G1", "G2"]}
      title="GPU Load"
      yAxisTitle="Load"
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
