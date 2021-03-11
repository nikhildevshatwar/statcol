export function parseFreeCommand(event) {
  if (!parseFreeCommand.hasOwnProperty("output")) {
    parseFreeCommand.output = ["", ""];
  }

  if (event.data.startsWith("Mem:")) {
    parseFreeCommand.output[0] = event.data;
  }
  if (event.data.startsWith("Swap:")) {
    parseFreeCommand.output[1] = event.data;
  }

  return parseFreeCommand.output[0]
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(1);
}

export function parseCPU(event) {
  return event.data.split(" ").map((str) => parseInt(str));
}

export function parseTemp(event) {
  const data = event.data.split(" ");

  return [
    parseFloat(data[3]),
    parseFloat(data[5]),
    parseFloat(data[7]),
    parseFloat(data[9]),
    parseFloat(data[11]),
  ];
}

export function parseGPU(event) {
  return event.data.split(" ").map((str) => parseInt(str));
}

export function parseUptime(event) {
  return event.data.substring(3);
}

export function parseLoad(event) {
  const index = event.data.indexOf("load average: ");
  const loadAverages = event.data
    .substring(index + 14)
    .split(", ")
    .map((str) => parseFloat(str));

  return {
    past1Min: loadAverages[0],
    past5Min: loadAverages[1],
    past15Min: loadAverages[2],
  };
}

export function parseRandom(event) {
  return event.data.split(" ").map((str) => parseFloat(str));
}

export function parseRandom2(event) {
  return event.data.split(" ").map((str) => parseFloat(str));
}

export function parseRandom3(event) {
  return event.data.split(" ").map((str) => parseFloat(str));
}

export function parseRandom4(event) {
  return event.data.split(" ").map((str) => parseFloat(str));
}

export function parseRandom5(event) {
  return event.data.split(" ").map((str) => parseFloat(str));
}

export function parseDeadAlive(event) {
  return event.data === "1";
}
