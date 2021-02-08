import ipRegex from "ip-regex";
import { config, sockets } from "./globals";
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
    sockets.getByType("memory"),
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
    sockets.getByType("cpu"),
    Parsers.parseCPU,
    { samplingInterval: config.getByType("cpu").samplingInterval }
  );
};

export const connectToTemp = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "temp",
    sockets.getByType("temp"),
    Parsers.parseTemp,
    { samplingInterval: config.getByType("temp").samplingInterval }
  );
};

export const connectToGPU = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "gpu",
    sockets.getByType("gpu"),
    Parsers.parseGPU,
    { samplingInterval: config.getByType("gpu").samplingInterval }
  );
};

export const connectToUptime = (app) => {
  return connectToWebSocket(
    app.state.address,
    app.state.port,
    "uptime",
    sockets.getByType("uptime"),
    Parsers.parseUptime,
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
    sockets.getByType("load"),
    Parsers.parseLoad,
    {
      samplingInterval: config.getByType("load").samplingInterval,
    }
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
