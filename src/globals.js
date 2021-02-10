export const colors = {
  background: "#A3BCB6",
  appBar: "#39603D",
  container: "#3C403D",
  input: "#203522",
  text: "#FFFFFF",
  plot: "#E5ECF6",
};

function buildSocket(type, samplingInterval) {
  return {
    type: type,
    handle: null,
    address: "",
    port: "",
    updaters: [],
    closers: [],
    samplingInterval: samplingInterval,
  };
}

export const sockets = [
  buildSocket("memory", 0.3),
  buildSocket("cpu", 0.5),
  buildSocket("temp", 1.0),
  buildSocket("gpu", 1.5),
  buildSocket("uptime", 1.0),
  buildSocket("load", 1.0),
  buildSocket("random", 0.5),
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
