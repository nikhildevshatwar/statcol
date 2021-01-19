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

function MemCard({ memData, swapData }) {
  return (
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
            <StyledTableCell>{memData.total}</StyledTableCell>
            <StyledTableCell>{memData.used}</StyledTableCell>
            <StyledTableCell>{memData.free}</StyledTableCell>
            <StyledTableCell>{memData.shared}</StyledTableCell>
            <StyledTableCell>{memData.buffCache}</StyledTableCell>
            <StyledTableCell>{memData.available}</StyledTableCell>
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
            <StyledTableCell>{swapData.total}</StyledTableCell>
            <StyledTableCell>{swapData.used}</StyledTableCell>
            <StyledTableCell>{swapData.free}</StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default function LinuxTab(props) {
  return (
    <React.Fragment>
      <DataCard
        data={
          <MemCard
            memData={props.appData.memData}
            swapData={props.appData.swapData}
          />
        }
      />
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
    </React.Fragment>
  );
}
