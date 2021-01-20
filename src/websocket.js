import ipRegex from "ip-regex";

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

export default function connectToWebSocket(
  address,
  port,
  endpoint,
  parser,
  args = {}
) {
  if (
    !ipRegex({ exact: true, includeBoundaries: true }).test(address) &&
    address !== "localhost"
  ) {
    console.log("Invalid IP address: " + address);
    return;
  }

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

  const socket = new WebSocket(socketURL);
  socket.onmessage = parser;
}
