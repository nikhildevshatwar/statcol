import ipRegex from "ip-regex";
import { config } from "./globals";
import * as Parsers from "./parsers";

function argsToString(args) {
  /* 
    argsToString expects args to be an Object of
    key-value pairs where each value is either a
    Number or a String.
  */
  if (args === {}) {
    return "";
  }

  const pairToString = (key, value) => {
    if (typeof value === "number") {
      return `${key}=${value}`;
    } else {
      return `${key}=${value.replace(/\s+/g, " ").trim().replace(" ", "%20")}`;
    }
  };

  let encodedString = "";
  for (const [key, value] of Object.entries(args)) {
    encodedString += pairToString(key, value);
    encodedString += "&&";
  }

  return encodedString.substring(0, encodedString.length - 2);
}

const extractTimeString = (date) => {
  const time = date.toLocaleTimeString().split(" ");
  time[0] += [":", date.getMilliseconds()].join("");
  return time.join(" ");
};

function connectToWebSocket(address, port, endpoint, parser, args = {}) {
  if (
    !ipRegex({ exact: true, includeBoundaries: true }).test(address) &&
    address !== "localhost"
  ) {
    console.log("Invalid IP address: " + address);
    return;
  }

  const socketURL = [
    "ws://",
    address,
    ":",
    port,
    "/",
    endpoint,
    "?",
    argsToString(args),
  ].join("");

  const socket = new WebSocket(socketURL);
  socket.onmessage = parser;

  return socket;
}

export const connectToMemory = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "memory",
    (event) => {
      const parsedData = Parsers.parseFreeCommand(event);
      app.setState((state) => ({
        appData: {
          ...state.appData,
          memData: parsedData.memData,
          swapData: parsedData.swapData,
        },
      }));
    },
    {
      samplingInterval: config.samplingInterval.memory,
    }
  );
};

export const connectToUptime = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "uptime",
    (event) => {
      const parsedData = Parsers.parseUptime(event);
      app.setState((state) => ({
        appData: {
          ...state.appData,
          uptime: parsedData,
        },
      }));
    },
    {
      samplingInterval: config.samplingInterval.uptime,
    }
  );
};

export const connectToLoad = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "average_load",
    (event) => {
      const parsedData = Parsers.parseLoad(event);
      app.setState((state) => ({
        appData: {
          ...state.appData,
          load: parsedData,
        },
      }));
    },
    {
      samplingInterval: config.samplingInterval.load,
    }
  );
};

export const connectToCPU = (app) => {
  connectToWebSocket(
    app.state.address,
    app.state.port,
    "cpu",
    (event) => {
      const parsedData = Parsers.parseCPU(event);
      app.setState((state) => {
        if (state.appData.cpuData.d.length === config.clockCycle) {
          return {
            appData: {
              ...state.appData,
              cpuData: {
                d: [
                  ...state.appData.cpuData.d,
                  extractTimeString(new Date()),
                ].splice(1),
                c1: [...state.appData.cpuData.c1, parsedData[0]].splice(1),
                c2: [...state.appData.cpuData.c2, parsedData[1]].splice(1),
                c3: [...state.appData.cpuData.c3, parsedData[2]].splice(1),
                c4: [...state.appData.cpuData.c4, parsedData[3]].splice(1),
              },
            },
          };
        }
        return {
          appData: {
            ...state.appData,
            cpuData: {
              d: [...state.appData.cpuData.d, extractTimeString(new Date())],
              c1: [...state.appData.cpuData.c1, parsedData[0]],
              c2: [...state.appData.cpuData.c2, parsedData[1]],
              c3: [...state.appData.cpuData.c3, parsedData[2]],
              c4: [...state.appData.cpuData.c4, parsedData[3]],
            },
          },
        };
      });
    },
    { samplingInterval: config.samplingInterval.cpu }
  );
};

export const connectToTemp = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "temp",
    (event) => {
      const parsedData = Parsers.parseTemp(event);
      app.setState((state) => {
        if (state.appData.tempData.d.length === config.clockCycle) {
          return {
            appData: {
              ...state.appData,
              tempData: {
                d: [
                  ...state.appData.tempData.d,
                  extractTimeString(new Date()),
                ].splice(1),
                t1: [...state.appData.tempData.t1, parsedData[0]].splice(1),
                t2: [...state.appData.tempData.t2, parsedData[1]].splice(1),
                t3: [...state.appData.tempData.t3, parsedData[2]].splice(1),
                t4: [...state.appData.tempData.t4, parsedData[3]].splice(1),
                t5: [...state.appData.tempData.t5, parsedData[4]].splice(1),
                t6: [...state.appData.tempData.t6, parsedData[5]].splice(1),
                t7: [...state.appData.tempData.t7, parsedData[6]].splice(1),
              },
            },
          };
        }
        return {
          appData: {
            ...state.appData,
            tempData: {
              d: [...state.appData.tempData.d, extractTimeString(new Date())],
              t1: [...state.appData.tempData.t1, parsedData[0]],
              t2: [...state.appData.tempData.t2, parsedData[1]],
              t3: [...state.appData.tempData.t3, parsedData[2]],
              t4: [...state.appData.tempData.t4, parsedData[3]],
              t5: [...state.appData.tempData.t5, parsedData[4]],
              t6: [...state.appData.tempData.t6, parsedData[5]],
              t7: [...state.appData.tempData.t7, parsedData[6]],
            },
          },
        };
      });
    },
    { samplingInterval: config.samplingInterval.temp }
  );
};

export const connectToGPU = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "gpu",
    (event) => {
      const parsedData = Parsers.parseGPU(event);
      app.setState((state) => {
        if (state.appData.gpuData.d.length === config.clockCycle) {
          return {
            appData: {
              ...state.appData,
              gpuData: {
                d: [
                  ...state.appData.gpuData.d,
                  extractTimeString(new Date()),
                ].splice(1),
                g1: [...state.appData.gpuData.g1, parsedData[0]].splice(1),
                g2: [...state.appData.gpuData.g2, parsedData[1]].splice(1),
              },
            },
          };
        }
        return {
          appData: {
            ...state.appData,
            gpuData: {
              d: [...state.appData.gpuData.d, extractTimeString(new Date())],
              g1: [...state.appData.gpuData.g1, parsedData[0]],
              g2: [...state.appData.gpuData.g2, parsedData[1]],
            },
          },
        };
      });
    },
    { samplingInterval: config.samplingInterval.gpu }
  );
};
