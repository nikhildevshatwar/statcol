import ipRegex from "ip-regex";
import { config, sockets, extractTimeString } from "./globals";
import * as Parsers from "./parsers";
import { store } from "react-notifications-component";

function connectToWebSocket(
  address,
  port,
  endpoint,
  socketRef,
  parser,
  args = {}
) {
  if (
    !ipRegex({ exact: true, includeBoundaries: true }).test(address) &&
    address !== "localhost"
  ) {
    store.addNotification({
      title: `Connection to ${address}:${port}/${endpoint} Failed!`,
      message: `Invalid IP Address: ${address}`,
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
    return null;
  }
  if (parseInt(port) === "NaN") {
    store.addNotification({
      title: `Connection to ${address}:${port}/${endpoint} Failed!`,
      message: `Invalid Port Number: ${port}`,
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
    return null;
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

  const socketHandle = new WebSocket(socketURL);
  socketHandle.onmessage = (event) => {
    const parsedData = parser(event);
    socketRef.updaters.forEach((updater) => {
      updater(parsedData);
    });
  };
  socketHandle.onclose = (event) => {
    socketRef.closers.forEach((closer) => {
      closer(event);
    });
  };
  socketHandle.onerror = (event) => {
    store.addNotification({
      title: `Connection to ${address}:${port}/${endpoint} Failed!`,
      message: `URL: ${event.target.url}`,
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
    return null;
  };

  return socketHandle;
}

export const connectToMemory = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "memory",
    sockets.memory,
    Parsers.parseFreeCommand,
    {
      samplingInterval: config.getByType("memory").samplingInterval,
    }
  );
};

export const connectToCPU = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "cpu",
    sockets.cpu,
    Parsers.parseCPU,
    { samplingInterval: config.getByType("cpu").samplingInterval }
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
      samplingInterval: config.getByType("uptime").samplingInterval,
    }
  );
};

export const connectToLoad = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "load",
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
      samplingInterval: config.getByType("load").samplingInterval,
    }
  );
};

export const connectToTemp = (app) => {
  const tempConfig = config.getByType("temp");

  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "temp",
    (event) => {
      const parsedData = Parsers.parseTemp(event);
      app.setState((state) => {
        if (state.appData.tempData.d.length === tempConfig.clockCycle) {
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
    { samplingInterval: tempConfig.samplingInterval }
  );
};

export const connectToGPU = (app) => {
  const gpuConfig = config.getByType("gpu");

  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "gpu",
    (event) => {
      const parsedData = Parsers.parseGPU(event);
      app.setState((state) => {
        if (state.appData.gpuData.d.length === gpuConfig.clockCycle) {
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
    { samplingInterval: gpuConfig.samplingInterval }
  );
};

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
