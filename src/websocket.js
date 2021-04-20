import ipRegex from "ip-regex";
import * as Parsers from "./parsers";
import { store } from "react-notifications-component";

function buildSocket(type, parser, samplingInterval) {
  const socket = {
    type: type,
    handle: null,
    address: "",
    port: "",
    updaters: [],
    closers: [],
    parser: parser,
    args: {
      samplingInterval: samplingInterval,
    },
  };

  socket.init = (address, port) => {
    socket.address = address;
    socket.port = port;
  };

  socket.connect = () => {
    if (socket.handle !== null) {
      socket.handle.close();
      socket.handle = null;
    }

    socket.handle = connectToWebSocket(socket);
  };

  socket.add_argument = (key, value) => {
    socket.args[key] = value;

    return socket;
  };

  return socket;
}

export const Sockets = [
  buildSocket("memory", Parsers.parseFreeCommand, 0.3),
  buildSocket("cpu", Parsers.parseCPU, 0.5),
  buildSocket("remote_cpuload", Parsers.parseRemoteCPU, 0.5),
  buildSocket("power_logger", Parsers.parseTemp, 1.0).add_argument(
    "numSamples",
    1000
  ),
  buildSocket("gpu", Parsers.parseGPU, 1.5),
  buildSocket("uptime", Parsers.parseUptime, 1.0),
  buildSocket("load", Parsers.parseLoad, 1.0),
  buildSocket("random", Parsers.parseRandom, 0.5),
  buildSocket("random2", Parsers.parseRandom2, 0.5),
  buildSocket("random3", Parsers.parseRandom3, 0.5),
  buildSocket("random4", Parsers.parseRandom4, 0.5),
  buildSocket("random5", Parsers.parseRandom5, 0.5),
  buildSocket("dead_alive", Parsers.parseDeadAlive, 0.5),
  buildSocket("meter_example", Parsers.parseMeter, 0.5),
];

Sockets.getByType = (type) => {
  for (let socketObj of Sockets) {
    if (socketObj.type === type) {
      return socketObj;
    }
  }
};

function connectToWebSocket(socketRef) {
  if (
    !ipRegex({ exact: true, includeBoundaries: true }).test(
      socketRef.address
    ) &&
    socketRef.address !== "localhost"
  ) {
    store.addNotification({
      title: `Connection to ${socketRef.address}:${socketRef.port}/${socketRef.type} Failed!`,
      message: `Invalid IP Address: ${socketRef.address}`,
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
  if (parseInt(socketRef.port) === "NaN") {
    store.addNotification({
      title: `Connection to ${socketRef.address}:${socketRef.port}/${socketRef.type} Failed!`,
      message: `Invalid Port Number: ${socketRef.port}`,
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
    socketRef.address,
    ":",
    socketRef.port,
    "/",
    socketRef.type,
    "?",
    argsToString(socketRef.args),
  ].join("");

  const socketHandle = new WebSocket(socketURL);
  socketHandle.onmessage = (event) => {
    const parsedData = socketRef.parser(event);
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
      title: `Connection to ${socketRef.address}:${socketRef.port}/${socketRef.type} Failed!`,
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
