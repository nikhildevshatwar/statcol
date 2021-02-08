export const colors = {
  background: "#A3BCB6",
  appBar: "#39603D",
  container: "#3C403D",
  input: "#203522",
  text: "#FFFFFF",
  plot: "#E5ECF6",
};

export const sockets = {
  memory: { handle: null, updaters: [], closers: [] },
  uptime: null,
  load: null,
  cpu: null,
  temp: null,
  gpu: null,
};

export const config = [
  { type: "memory", samplingInterval: 0.3 },
  { type: "cpu", samplingInterval: 0.5, clockCycle: 1000 },
  { type: "temp", samplingInterval: 1.0, clockCycle: 1000 },
  { type: "gpu", samplingInterval: 1.5, clockCycle: 1000 },
  { type: "uptime", samplingInterval: 1.0 },
  { type: "load", samplingInterval: 1.0 },
];

config.getByType = (type) => {
  for (let configObj of config) {
    if (configObj.type === type) {
      return configObj;
    }
  }
};
