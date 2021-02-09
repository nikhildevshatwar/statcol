import React, { useEffect } from "react";
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
import * as Sockets from "./websocket";

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
  const [memData, setMemData] = React.useState({
    total: 0,
    free: 0,
    used: 0,
    buffCache: 0,
    shared: 0,
    available: 0,
  });
  const [swapData, setSwapData] = React.useState({
    total: 0,
    free: 0,
    used: 0,
  });

  useEffect(() => {
    sockets.getByType("memory").updaters.push((parsedData) => {
      setMemData(parsedData.memData);
      setSwapData(parsedData.swapData);
    });
    sockets.getByType("memory").closers.push((event) => {
      setMemData({
        total: 0,
        free: 0,
        used: 0,
        buffCache: 0,
        shared: 0,
        available: 0,
      });
      setSwapData({ total: 0, free: 0, used: 0 });
    });
  }, []);

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

  function reset() {
    if (sockets.getByType("memory").handle !== null) {
      sockets.getByType("memory").handle.close();
    }

    sockets.getByType("memory").handle = Sockets.connectByType(
      "memory",
      this.props.address,
      this.props.port
    )(props.appRef);
  }

  return (
    <DataCard
      data={data}
      resetHandler={reset}
      resetHandlerName="memReset"
      settings={{
        name: "Memory",
        configOptions: [
          {
            id: "samplingInterval",
            name: "Sampling Interval",
            defaultValue: sockets.getByType("memory").samplingInterval,
            update: (newValue) => {
              sockets.getByType("memory").samplingInterval = newValue;
            },
          },
        ],
      }}
    />
  );
}

function MemChart(props) {
  const [memData, setMemData] = React.useState({
    total: 0,
    free: 0,
    used: 0,
    buffCache: 0,
    shared: 0,
    available: 0,
  });

  useEffect(() => {
    sockets.getByType("memory").updaters.push((parsedData) => {
      setMemData(parsedData.memData);
    });
    sockets.getByType("memory").closers.push((event) => {
      setMemData({
        total: 0,
        free: 0,
        used: 0,
        buffCache: 0,
        shared: 0,
        available: 0,
      });
    });
  }, []);

  function reset() {
    if (sockets.getByType("memory").handle !== null) {
      sockets.getByType("memory").handle.close();
    }

    sockets.getByType("memory").handle = Sockets.connectByType("memory")(
      props.appRef
    );
  }

  return (
    <React.Fragment>
      <PieChart
        data={[
          {
            name: "Main Memory",
            values: [
              memData.free,
              memData.used,
              memData.buffCache,
              memData.shared,
            ],
            labels: ["Free", "Used", "Buffer and Cache", "Shared"],
          },
        ]}
        resetHandler={reset}
        resetHandlerName="memReset2"
        settings={{
          name: "Memory",
          configOptions: [
            {
              id: "samplingInterval",
              name: "Sampling Interval",
              defaultValue: sockets.getByType("memory").samplingInterval,
              update: (newValue) => {
                sockets.getByType("memory").samplingInterval = newValue;
              },
            },
          ],
        }}
      />
    </React.Fragment>
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
      <CPUSeries {...props} />
    </React.Fragment>
  );
}
