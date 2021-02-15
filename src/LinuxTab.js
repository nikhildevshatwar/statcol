import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { colors } from "./globals";
import DataCard from "./components/DataCard";
import TimeSeries from "./components/TimeSeries";
import PieChart from "./components/PieChart";
import { Sockets } from "./websocket";

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

const useStyles = makeStyles({
  chart: {
    display: "flex",
    flexDirection: "row",
  },
});

function MemCard() {
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
      socket={Sockets.getByType("memory")}
      content={content}
      resetHandlerName="memReset"
      settingsName="Memory"
    />
  );
}

function MemChart() {
  return (
    <PieChart
      socketObjs={[
        {
          socket: Sockets.getByType("memory"),
          parser: (parsedData) => parsedData.slice(1, 5),
        },
        {
          socket: Sockets.getByType("random"),
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

function CPUSeries() {
  return (
    <TimeSeries
      socket={Sockets.getByType("cpu")}
      seriesNames={["C1", "C2", "C3", "C4"]}
      title="CPU Load"
      yAxisTitle="Load"
      resetHandlerName="cpuReset"
      settingsName="CPU"
    />
  );
}

function TempSeries() {
  return (
    <TimeSeries
      socket={Sockets.getByType("temp")}
      seriesNames={["T1", "T2", "T3", "T4", "T5", "T6", "T7"]}
      title="Temperature Load"
      yAxisTitle="Load"
      resetHandlerName="tempReset"
      settingsName="Temperature"
    />
  );
}

export default function LinuxTab() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <MemCard />
      <MemChart />
      <div className={classes.chart}>
        <CPUSeries />
        <TempSeries />
      </div>
    </React.Fragment>
  );
}
