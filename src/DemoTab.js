import React from "react";
import TimeSeries from "./components/TimeSeries";
import Meter from "./components/Meter";
import PieChart from "./components/PieChart";
import { Sockets } from "./websocket";

function GPUSeries() {
  return (
    <TimeSeries
      socket={Sockets.getByType("gpu")}
      title="GPU Load"
      yAxisTitle="Load"
      settingsName="GPU"
    />
  );

function MeterExample() {
    return (<Meter socket={Sockets.getByType("meter_example")} settingsName="Meter Example" />);
  }
}
function RandomChart() {
  return (
    <PieChart
      socketObjs={[
        {
          socket: Sockets.getByType("random"),
          parser: (parsedData) => parsedData,
        },
        {
          socket: Sockets.getByType("random2"),
          parser: (parsedData) => parsedData,
        },
        {
          socket: Sockets.getByType("random3"),
          parser: (parsedData) => parsedData,
        },
        {
          socket: Sockets.getByType("random4"),
          parser: (parsedData) => parsedData,
        },
        {
          socket: Sockets.getByType("random5"),
          parser: (parsedData) => parsedData,
        },
      ]}
      labelSets={[
        ["X", "Y", "Z", "W"],
        ["X", "Y", "Z", "W"],
        ["X", "Y", "Z", "W"],
        ["X", "Y", "Z", "W"],
        ["X", "Y", "Z", "W"],
      ]}
      titles={["Random", "R2", "R3", "R4", "R5"]}
      settingsName="Random"
    />
  );
}


export default function DemoTab() {
  return (
    <React.Fragment>
      <GPUSeries />
      <MeterExample />
      <RandomChart />
    </React.Fragment>
  );
}
