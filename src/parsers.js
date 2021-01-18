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

  const memData = parseFreeCommand.output[0]
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
  const swapData = parseFreeCommand.output[1]
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

  return {
    memData: {
      total: memData[1],
      used: memData[2],
      free: memData[3],
      shared: memData[4],
      buffCache: memData[5],
      available: memData[6],
    },
    swapData: {
      total: swapData[1],
      used: swapData[2],
      free: swapData[3],
    },
  };
}
