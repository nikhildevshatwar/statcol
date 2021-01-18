import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { colors } from "./globals";

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

export function parseFreeCommand(event) {
  if (!parseFreeCommand.hasOwnProperty("output")) {
    parseFreeCommand.output = ["", ""];
  }

  if (event.data.startsWith("Mem:")) {
    parseFreeCommand.output[0] = event.data;
  }
  if (event.data.startsWith("Swap:")) {
    parseFreeCommand.output[1] = event.data;
  }

  const memData = parseFreeCommand.output[0]
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
  const swapData = parseFreeCommand.output[1]
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

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
            <StyledTableCell>{memData[1]}</StyledTableCell>
            <StyledTableCell>{memData[2]}</StyledTableCell>
            <StyledTableCell>{memData[3]}</StyledTableCell>
            <StyledTableCell>{memData[4]}</StyledTableCell>
            <StyledTableCell>{memData[5]}</StyledTableCell>
            <StyledTableCell>{memData[6]}</StyledTableCell>
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
            <StyledTableCell>{swapData[1]}</StyledTableCell>
            <StyledTableCell>{swapData[2]}</StyledTableCell>
            <StyledTableCell>{swapData[3]}</StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
