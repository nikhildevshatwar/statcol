import ipRegex from "ip-regex";

export default function connectToWebSocket(address, port, endpoint, parser) {
  if (
    !ipRegex({ exact: true, includeBoundaries: true }).test(address) &&
    address !== "localhost"
  ) {
    console.log("Invalid IP address: " + address);
    return;
  }

  const socketURL = ["ws://", address, ":", port, "/", endpoint].join("");

  const socket = new WebSocket(socketURL);
  socket.onmessage = parser;
}
