export const colors = {
  background: "#A3BCB6",
  appBar: "#39603D",
  container: "#3C403D",
  input: "#203522",
  text: "#FFFFFF",
  plot: "#E5ECF6",
};

export const sockets = [
  {
    type: "memory",
    handle: null,
    address: "",
    port: "",
    updaters: [],
    closers: [],
    samplingInterval: 0.3,
  },
  {
    type: "cpu",
    handle: null,
    address: "",
    port: "",
    updaters: [],
    closers: [],
    samplingInterval: 0.5,
  },
  {
    type: "temp",
    handle: null,
    address: "",
    port: "",
    updaters: [],
    closers: [],
    samplingInterval: 1.0,
  },
  {
    type: "gpu",
    handle: null,
    address: "",
    port: "",
    updaters: [],
    closers: [],
    samplingInterval: 1.5,
  },
  {
    type: "uptime",
    handle: null,
    address: "",
    port: "",
    updaters: [],
    closers: [],
    samplingInterval: 1.0,
  },
  {
    type: "load",
    handle: null,
    address: "",
    port: "",
    updaters: [],
    closers: [],
    samplingInterval: 1.0,
  },
];

sockets.getByType = (type) => {
  for (let socketObj of sockets) {
    if (socketObj.type === type) {
      return socketObj;
    }
  }
};

export const extractTimeString = (date) => {
  const time = date.toLocaleTimeString().split(" ");
  time[0] += [":", date.getMilliseconds()].join("");
  return time.join(" ");
};
