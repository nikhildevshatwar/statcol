import ipRegex from "ip-regex";
import { config, sockets } from "./globals";
import * as Parsers from "./parsers";
import { store } from "react-notifications-component";

export function connectByType(type) {
  switch (type) {
    case "memory":
      return connectToWebSocket(
        "memory",
        sockets.getByType("memory"),
        Parsers.parseFreeCommand,
        {
          samplingInterval: config.getByType("memory").samplingInterval,
        }
      );
    case "cpu":
      return connectToWebSocket(
        "cpu",
        sockets.getByType("cpu"),
        Parsers.parseCPU,
        { samplingInterval: config.getByType("cpu").samplingInterval }
      );
    case "temp":
      return connectToWebSocket(
        "temp",
        sockets.getByType("temp"),
        Parsers.parseTemp,
        { samplingInterval: config.getByType("temp").samplingInterval }
      );
    case "gpu":
      return connectToWebSocket(
        "gpu",
        sockets.getByType("gpu"),
        Parsers.parseGPU,
        { samplingInterval: config.getByType("gpu").samplingInterval }
      );
    case "uptime":
      return connectToWebSocket(
        "uptime",
        sockets.getByType("uptime"),
        Parsers.parseUptime,
        {
          samplingInterval: config.getByType("uptime").samplingInterval,
        }
      );
    case "load":
      return connectToWebSocket(
        "load",
        sockets.getByType("load"),
        Parsers.parseLoad,
        {
          samplingInterval: config.getByType("load").samplingInterval,
        }
      );
  }
}

function connectToWebSocket(endpoint, socketRef, parser, args = {}) {
  const appConfig = config.getByType("app");

  if (
    !ipRegex({ exact: true, includeBoundaries: true }).test(
      appConfig.address
    ) &&
    appConfig.address !== "localhost"
  ) {
    store.addNotification({
      title: `Connection to ${appConfig.address}:${appConfig.port}/${endpoint} Failed!`,
      message: `Invalid IP Address: ${appConfig.address}`,
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
  if (parseInt(appConfig.port) === "NaN") {
    store.addNotification({
      title: `Connection to ${appConfig.address}:${appConfig.port}/${endpoint} Failed!`,
      message: `Invalid Port Number: ${appConfig.port}`,
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
    appConfig.address,
    ":",
    appConfig.port,
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
      title: `Connection to ${appConfig.address}:${appConfig.port}/${endpoint} Failed!`,
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
