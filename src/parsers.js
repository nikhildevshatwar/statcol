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
  const data = event.data.split(" ");
  const count = parseInt(data[0]);
  if (isNaN(count)) {
    return null;
  }

  if (!parseCPU.hasOwnProperty("seriesName")) {
    parseCPU.seriesName = new Array(count).fill(0).map((_, index) => {
      return data[2 * index + 1];
    });
  }

  const parsedData = new Array(count).fill(0).map((_, index) => {
    return parseInt(data[2 * index + 2]);
  });

  return [parseCPU.seriesName, parsedData];
}

export function parseTemp(event) {
  const data = event.data.split(" ");
  const count = parseInt(data[0]);
  if (isNaN(count)) {
    return null;
  }

  if (!parseTemp.hasOwnProperty("seriesName")) {
    parseTemp.seriesName = new Array(count).fill(0).map((_, index) => {
      return data[2 * index + 1];
    });
  }

  const parsedData = new Array(count).fill(0).map((_, index) => {
    return parseFloat(data[2 * index + 2]);
  });

  return [parseTemp.seriesName, parsedData];
}

export function parseGPU(event) {
  const data = event.data.split(" ");
  const count = parseInt(data[0]);
  if (isNaN(count)) {
    return null;
  }

  if (!parseGPU.hasOwnProperty("seriesName")) {
    parseGPU.seriesName = new Array(count).fill(0).map((_, index) => {
      return data[2 * index + 1];
    });
  }

  const parsedData = new Array(count).fill(0).map((_, index) => {
    return parseInt(data[2 * index + 2]);
  });

  return [parseGPU.seriesName, parsedData];
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
