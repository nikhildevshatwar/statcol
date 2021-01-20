import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { colors } from "./globals";
import DataCard from "./components/DataCard";
import TimeSeries from "./components/TimeSeries";

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
  const data = (
    <React.Fragment>
      Memory (In MB):
      <Table size="small">
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
            <StyledTableCell>{props.appData.memData.total}</StyledTableCell>
            <StyledTableCell>{props.appData.memData.used}</StyledTableCell>
            <StyledTableCell>{props.appData.memData.free}</StyledTableCell>
            <StyledTableCell>{props.appData.memData.shared}</StyledTableCell>
            <StyledTableCell>{props.appData.memData.buffCache}</StyledTableCell>
            <StyledTableCell>{props.appData.memData.available}</StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
      Swap Memory (In MB):
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>Total</StyledTableCell>
            <StyledTableCell>Used</StyledTableCell>
            <StyledTableCell>Free</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <StyledTableCell>{props.appData.swapData.total}</StyledTableCell>
            <StyledTableCell>{props.appData.swapData.used}</StyledTableCell>
            <StyledTableCell>{props.appData.swapData.free}</StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </React.Fragment>
  );

  return <DataCard data={data} />;
}

function CPUSeries(props) {
  return (
    <TimeSeries
      data={[
        {
          name: "C1",
          xData: props.appData.cpuData.d,
          yData: props.appData.cpuData.c1,
        },
        {
          name: "C2",
          xData: props.appData.cpuData.d,
          yData: props.appData.cpuData.c2,
        },
        {
          name: "C3",
          xData: props.appData.cpuData.d,
          yData: props.appData.cpuData.c3,
        },
        {
          name: "C4",
          xData: props.appData.cpuData.d,
          yData: props.appData.cpuData.c4,
        },
      ]}
      title="CPU Load"
      xAxisTitle="Time"
      yAxisTitle="Load"
    />
  );
}

export default function LinuxTab(props) {
  return (
    <React.Fragment>
      <MemCard appData={props.appData} />
      <CPUSeries appData={props.appData} />
    </React.Fragment>
  );
}
