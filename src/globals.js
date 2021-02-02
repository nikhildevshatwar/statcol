export const colors = {
  background: "#A3BCB6",
  appBar: "#39603D",
  container: "#3C403D",
  input: "#203522",
  text: "#FFFFFF",
  plot: "#E5ECF6",
};

export const sockets = {
  memory: null,
  uptime: null,
  average_load: null,
  cpu: null,
  temp: null,
  gpu: null,
};

export const config = {
  samplingInterval: {
    memory: 0.3,
    cpu: 0.5,
    temp: 1.0,
    gpu: 1.5,
    uptime: 1.0,
    load: 1.0,
  },
  clockCycle: 1000,
};
