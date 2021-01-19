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
  console.log(props);
  let d11 = [],
    d12 = [];
  for (let i = 0; i < 100; i++) {
    d11.push(i);
    d12.push(i);
  }
  let d21 = [],
    d22 = [];
  for (let i = 0; i < 100; i++) {
    d21.push(i);
    d22.push(2 * i + 3);
  }

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
          { name: "data1", xData: d11, yData: d12 },
          { name: "data2", xData: d21, yData: d22 },
        ]}
        title="TITLE"
        xAxisTitle="XAXIS"
        yAxisTitle="YAXIS"
      />
    </React.Fragment>
  );
}
