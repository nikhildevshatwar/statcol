export default class WebSocketManager {
  constructor(endpoints) {
    this.sockets = new Map();
    this.endpoints = endpoints;

    for (let endpoint of this.endpoints) {
      this.sockets.set(endpoint, null);
    }
  }

  validateAddress(address) {
    const blocks = address.split(".");
    if (blocks.length !== 4) return false;

    for (let block of blocks) {
      const value = parseInt(block);
      if (value < 0 || value > 255) return false;
    }

    return true;
  }

  connect(address, endpoint) {
    const addressValidity = this.validateAddress(address);

    if (!addressValidity) {
      console.log("Invalid IP Address");
      return;
    }

    const endpointAvailablity = this.endpoints.includes(endpoint);

    if (!endpointAvailablity) {
      console.log("Endpoint not found");
      return;
    }

    let socket = this.sockets.get(endpoint);
    if (socket != null) {
      socket.close();
    }
    const socketURL = ["ws://", address, ":", "8080", "/", endpoint].join("");
    const newSocket = new WebSocket(socketURL);
    newSocket.onmessage = (event) => {
      console.log(event.data);
    };

    this.sockets.set(endpoint, newSocket);
  }
}
