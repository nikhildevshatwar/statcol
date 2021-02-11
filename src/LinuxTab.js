import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { colors, sockets } from "./globals";
import DataCard from "./components/DataCard";
import TimeSeries from "./components/TimeSeries";
import PieChart from "./components/PieChart";

const StyledTableCell = withStyles({
  head: {
    backgroundColor: colors.container,
    color: colors.text,
  },
  body: {
    fontSize: 14,
    color: colors.text,
  },
})(TableCell);

function MemCard(props) {
  const content = (parsedData) => {
    return (
      <Table size="small">
        Memory (In MB):
        <TableHead>
          <TableRow color="white">
            <StyledTableCell>Total</StyledTableCell>
            <StyledTableCell>Used</StyledTableCell>
            <StyledTableCell>Free</StyledTableCell>
            <StyledTableCell>Shared</StyledTableCell>
            <StyledTableCell>Buffers and Cache</StyledTableCell>
            <StyledTableCell>Memory Available for Applications</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <StyledTableCell>{parsedData[0]}</StyledTableCell>
            <StyledTableCell>{parsedData[1]}</StyledTableCell>
            <StyledTableCell>{parsedData[2]}</StyledTableCell>
            <StyledTableCell>{parsedData[3]}</StyledTableCell>
            <StyledTableCell>{parsedData[4]}</StyledTableCell>
            <StyledTableCell>{parsedData[5]}</StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <DataCard
      socket={sockets.getByType("memory")}
      content={content}
      resetHandlerName="memReset"
      settingsName="Memory"
    />
  );
}

function MemChart(props) {
  return (
    <PieChart
      socketObjs={[
        {
          socket: sockets.getByType("memory"),
          parser: (parsedData) => parsedData.slice(1, 5),
        },
        {
          socket: sockets.getByType("random"),
          parser: (parsedData) => parsedData,
        },
      ]}
      labelSets={[
        ["Free", "Used", "Buffer and Cache", "Shared"],
        ["X", "Y", "Z", "W"],
      ]}
      titles={["Main Memory", "Random"]}
      resetHandlerName="memReset2"
      settingsName="Memory and Random"
    />
  );
}

function CPUSeries(props) {
  return (
    <TimeSeries
      socket={sockets.getByType("cpu")}
      seriesNames={["C1", "C2", "C3", "C4"]}
      title="CPU Load"
      yAxisTitle="Load"
      resetHandlerName="cpuReset"
      settingsName="CPU"
    />
  );
}

function TempSeries(props) {
  return (
    <TimeSeries
      socket={sockets.getByType("temp")}
      seriesNames={["T1", "T2", "T3", "T4", "T5", "T6", "T7"]}
      title="Temperature Load"
      yAxisTitle="Load"
      resetHandlerName="tempReset"
      settingsName="Temperature"
    />
  );
}

export default function LinuxTab({ ...props }) {
  return (
    <React.Fragment>
      <MemCard {...props} />
      <MemChart {...props} />
      <CPUSeries {...props} />
      <TempSeries {...props} />
    </React.Fragment>
  );
}
