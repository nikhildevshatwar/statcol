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
import { Typography } from "@material-ui/core";
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

  return (
    <DataCard
      data={data}
      resetHandler={() => {
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
      }}
    />
  );
}

function MemChart(props) {
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
        resetHandler={() => {
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
        }}
      />
      <PieChart
        data={[
          {
            name: "Swap Memory",
            values: [props.appData.swapData.free, props.appData.swapData.used],
            labels: ["Free Swap Memory", "Used Swap Memory"],
          },
        ]}
        resetHandler={() => {
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
        }}
      />
    </React.Fragment>
  );
}

function UptimeCard(props) {
  const data = <Typography>Active Since: {props.appData.uptime}</Typography>;

  return (
    <DataCard
      data={data}
      resetHandler={() => {
        sockets.uptime.close();
        props.appRef.updateAppData({
          uptime: "",
        });
        sockets.uptime = Sockets.connectToUptime(props.appRef);
      }}
    />
  );
}

function LoadCard(props) {
  const data = (
    <React.Fragment>
      <Typography>
        Load Average for past 1 minute: {props.appData.load.past1Min}
      </Typography>
      <Typography>
        Load Average for past 5 minute: {props.appData.load.past5Min}
      </Typography>
      <Typography>
        Load Average for past 15 minute: {props.appData.load.past15Min}
      </Typography>
    </React.Fragment>
  );

  return (
    <DataCard
      data={data}
      resetHandler={() => {
        sockets.average_load.close();
        props.appRef.updateAppData({
          load: {
            past1Min: 0.0,
            past5Min: 0.0,
            past15Min: 0.0,
          },
        });
        sockets.average_load = Sockets.connectToLoad(props.appRef);
      }}
    />
  );
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
      resetHandler={() => {
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
      }}
    />
  );
}

function TempSeries(props) {
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
      resetHandler={() => {
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
      }}
    />
  );
}

export default function LinuxTab({ ...props }) {
  return (
    <React.Fragment>
      <MemCard {...props} />
      <MemChart {...props} />
      <UptimeCard {...props} />
      <LoadCard {...props} />
      <CPUSeries {...props} />
      <TempSeries {...props} />
    </React.Fragment>
  );
}
