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

/* Move to Generic location */
const StyledTableCell = withStyles({
  head: {
    backgroundColor: colors.container,
    color: colors.text,
  },
  body: {
    fontSize: 14,
    textAlign: "right",
    color: colors.text,
  },
})(TableCell);

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  table: {
    tableLayout: "fixed",
  },
});

function parseDemoOutput(output, name) {
  const tableHeadRow = ["Name", "Value", "Average Value"].map(title => <StyledTableCell>{title}</StyledTableCell>);
  const tableBodyRow = [];
  for(let [key, value] of Object.entries(output)) {
    tableBodyRow.push(
    <TableRow>
      <StyledTableCell>{key}</StyledTableCell>
      <StyledTableCell>{value[0]}</StyledTableCell>
      <StyledTableCell>{value[1]}</StyledTableCell>
    </TableRow>
    )
  }

  return (
    <Table size="small" style={{tableLayout: 'fixed'}}>
      {name}
      <TableHead>
        <TableRow color="white">
          {tableHeadRow}
        </TableRow>
      </TableHead>
      <TableBody>
       {tableBodyRow} 
      </TableBody>
    </Table>
  );
}

function DemoCard() {
  const content = (parsedData) => {
    return parseDemoOutput(parsedData, "Object Detection Demo Statistics (in ms)");
  };

  return (
    <DataCard
      socket={Sockets.getByType("demo_test")}
      content={content}
      settingsName="Demo Test"
    />
  );
}

function MemCard() {
  const content = (parsedData) => {
    return (
      <Table size="small" style={{tableLayout: 'fixed'}}>
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
      ]}
      labelSets={[
        ["Free", "Used", "Buffer and Cache", "Shared"],
      ]}
      titles={["Main Memory"]}
      settingsName="Memory"
    />
  );
}

function CPUSeries() {
  return (
    <TimeSeries
      socket={Sockets.getByType("cpu")}
      title="CPU Load"
      yAxisTitle="Load"
      yAxisRange={[0, 100]}
      settingsName="CPU"
    />
  );
}

function TempSeries() {
  return (
    <TimeSeries
      socket={Sockets.getByType("power_logger")}
      title="Temperature Load"
      yAxisTitle="Load"
      settingsName="Temperature"
    />
  );
}

function RemoteCPUSeries() {
  return (
    <TimeSeries
      socket={Sockets.getByType("remote_cpuload")}
      title="Remote CPU"
      yAxisTitle="Load"
      yAxisRange={[0, 100]}
      settingsName="Remote CPU"
    />
  );
}

export default function EdgeAITab() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MemCard/>
      <MemChart />
      <CPUSeries />
      <TempSeries />
      <RemoteCPUSeries />
      <DemoCard />
    </div>
  );
}
