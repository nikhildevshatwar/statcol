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
        ["Free", "Used", "Buffer and Cache", "Shared"],
        ["X", "Y", "Z", "W"],
        ["X", "Y", "Z", "W"],
        ["X", "Y", "Z", "W"],
        ["X", "Y", "Z", "W"],
        ["X", "Y", "Z", "W"],
      ]}
      titles={["Main Memory", "Random", "R2", "R3", "R4", "R5"]}
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
      settingsName="CPU"
    />
  );
}

function TempSeries() {
  return (
    <TimeSeries
      socket={Sockets.getByType("power_logger")}
      seriesNames={["MCU", "CORE", "CPU", "USB", "Total 16 Rails"]}
      title="Temperature Load"
      yAxisTitle="Load"
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
