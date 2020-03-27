const usersDb = require("./usersDb");
const { parseCookie } = require("./helpers");
const { verifyAndDecode } = require("../jwt/jwtdecoder");

class ConnectionHandler {
  constructor(onOpenSocket, onCloseSocket, onMessage) {
    this.events = { onOpenSocket, onCloseSocket, onMessage };
    this.handle = this.handle.bind(this);
  }

  handleMessage(client, message) {
    let reqObj;

    try {
      console.log("=================message");
      console.log(message);
      reqObj = JSON.parse(message);
    } catch (e) {
      reqObj = null;
    }

    this.events.onMessage(client, reqObj);
  }

  handle(client, req) {
    const token = req.headers.token;
    //client.user = token ? usersDb.findOne({ token }) : null;
    console.log("------------------");
    console.log(token);
    const decoded = verifyAndDecode(token);
    client.user = decoded;
    console.log(decoded.ID);
    console.log("------------------");
    client.on("message", message => this.handleMessage(client, message));
    client.on("close", () => this.events.onCloseSocket(client));

    this.events.onOpenSocket(client);
  }
}

module.exports = ConnectionHandler;
