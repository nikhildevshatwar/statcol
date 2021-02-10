import ipRegex from "ip-regex";
import { sockets } from "./globals";
import * as Parsers from "./parsers";
import { store } from "react-notifications-component";

export function connectByType(type, address, port) {
  switch (type) {
    case "memory":
      return connectToWebSocket(
        address,
        port,
        "memory",
        sockets.getByType("memory"),
        Parsers.parseFreeCommand,
        {
          samplingInterval: sockets.getByType("memory").samplingInterval,
        }
      );
    case "cpu":
      return connectToWebSocket(
        address,
        port,
        "cpu",
        sockets.getByType("cpu"),
        Parsers.parseCPU,
        { samplingInterval: sockets.getByType("cpu").samplingInterval }
      );
    case "temp":
      return connectToWebSocket(
        address,
        port,
        "temp",
        sockets.getByType("temp"),
        Parsers.parseTemp,
        { samplingInterval: sockets.getByType("temp").samplingInterval }
      );
    case "gpu":
      return connectToWebSocket(
        address,
        port,
        "gpu",
        sockets.getByType("gpu"),
        Parsers.parseGPU,
        { samplingInterval: sockets.getByType("gpu").samplingInterval }
      );
    case "uptime":
      return connectToWebSocket(
        address,
        port,
        "uptime",
        sockets.getByType("uptime"),
        Parsers.parseUptime,
        {
          samplingInterval: sockets.getByType("uptime").samplingInterval,
        }
      );
    case "load":
      return connectToWebSocket(
        address,
        port,
        "load",
        sockets.getByType("load"),
        Parsers.parseLoad,
        {
          samplingInterval: sockets.getByType("load").samplingInterval,
        }
      );
    case "random":
      return connectToWebSocket(
        address,
        port,
        "random",
        sockets.getByType("random"),
        Parsers.parseRandom,
        { samplingInterval: sockets.getByType("random").samplingInterval }
      );
  }
}

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

  socketRef.address = address;
  socketRef.port = port;

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
    socketRef.handle = null;
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
