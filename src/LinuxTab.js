import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { colors, config, sockets } from "./globals";
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

  function reset() {
    if (sockets.memory === null) {
      return;
    }

    sockets.memory.close();
    props.appRef.updateAppData({
      memData: {
        total: 0,
        free: 0,
        used: 0,
        buffCache: 0,
        shared: 0,
        available: 0,
      },
      swapData: { total: 0, free: 0, used: 0 },
    });
    sockets.memory = Sockets.connectToMemory(props.appRef);
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
            defaultValue: config.getByType("memory").samplingInterval,
            update: (newValue) => {
              config.getByType("memory").samplingInterval = newValue;
            },
          },
        ],
      }}
    />
  );
}

function MemChart(props) {
  function reset() {
    if (sockets.memory === null) {
      return;
    }

    sockets.memory.close();
    props.appRef.updateAppData({
      memData: {
        total: 0,
        free: 0,
        used: 0,
        buffCache: 0,
        shared: 0,
        available: 0,
      },
      swapData: { total: 0, free: 0, used: 0 },
    });
    sockets.memory = Sockets.connectToMemory(props.appRef);
  }

  return (
    <React.Fragment>
      <PieChart
        data={[
          {
            name: "Main Memory",
            values: [
              props.appData.memData.free,
              props.appData.memData.used,
              props.appData.memData.buffCache,
              props.appData.memData.shared,
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
              defaultValue: config.getByType("memory").samplingInterval,
              update: (newValue) => {
                config.getByType("memory").samplingInterval = newValue;
              },
            },
          ],
        }}
      />
    </React.Fragment>
  );
}

function CPUSeries(props) {
  function reset() {
    if (sockets.cpu === null) {
      return;
    }

    sockets.cpu.close();
    props.appRef.updateAppData({
      cpuData: {
        d: [],
        c1: [],
        c2: [],
        c3: [],
        c4: [],
      },
    });
    sockets.cpu = Sockets.connectToCPU(props.appRef);
  }

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
      resetHandler={reset}
      resetHandlerName="cpuReset"
      settings={{
        name: "CPU",
        configOptions: [
          {
            id: "samplingInterval",
            name: "Sampling Interval",
            defaultValue: config.getByType("cpu").samplingInterval,
            update: (newValue) => {
              config.getByType("cpu").samplingInterval = newValue;
            },
          },
          {
            id: "clockCycle",
            name: "Clock Cycle",
            defaultValue: config.getByType("cpu").clockCycle,
            update: (newValue) => {
              config.getByType("cpu").clockCycle = parseInt(newValue);
            },
          },
        ],
      }}
    />
  );
}

function TempSeries(props) {
  function reset() {
    if (sockets.temp === null) {
      return;
    }

    sockets.temp.close();
    props.appRef.updateAppData({
      tempData: {
        d: [],
        t1: [],
        t2: [],
        t3: [],
        t4: [],
        t5: [],
        t6: [],
        t7: [],
      },
    });
    sockets.temp = Sockets.connectToTemp(props.appRef);
  }

  return (
    <TimeSeries
      data={[
        {
          name: "T1",
          xData: props.appData.tempData.d,
          yData: props.appData.tempData.t1,
        },
        {
          name: "T2",
          xData: props.appData.tempData.d,
          yData: props.appData.tempData.t2,
        },
        {
          name: "T3",
          xData: props.appData.tempData.d,
          yData: props.appData.tempData.t3,
        },
        {
          name: "T4",
          xData: props.appData.tempData.d,
          yData: props.appData.tempData.t4,
        },
        {
          name: "T5",
          xData: props.appData.tempData.d,
          yData: props.appData.tempData.t5,
        },
        {
          name: "T6",
          xData: props.appData.tempData.d,
          yData: props.appData.tempData.t6,
        },
        {
          name: "T7",
          xData: props.appData.tempData.d,
          yData: props.appData.tempData.t7,
        },
      ]}
      title="Temperature (Celsius)"
      xAxisTitle="Time"
      yAxisTitle="Temperature (Celsius)"
      resetHandler={reset}
      resetHandlerName="tempReset"
      settings={{
        name: "Temperature",
        configOptions: [
          {
            id: "samplingInterval",
            name: "Sampling Interval",
            defaultValue: config.getByType("temp").samplingInterval,
            update: (newValue) => {
              config.getByType("temp").samplingInterval = newValue;
            },
          },
          {
            id: "clockCycle",
            name: "Clock Cycle",
            defaultValue: config.getByType("temp").clockCycle,
            update: (newValue) => {
              config.getByType("temp").clockCycle = parseInt(newValue);
            },
          },
        ],
      }}
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
