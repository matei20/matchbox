const WebSocket = require("ws");
const ConnectionHandler = require("./handler");
const Db = require("../db/db");

async function main() {

  await Db.connect();
  const wss = new WebSocket.Server({ port: 5000 });
  const clients = [];

  function onOpenSocket(client) {
    if (!client.user) {
      client.send('{"error": "Unauthenticated"}');
      return client.close();
    }

    clients.push(client);

    console.log(clients.map(c => c.user.ID)); // debugging
    console.log("client connected");
  }

  function onCloseSocket(client) {
    clients.splice(clients.indexOf(client), 1);
    console.log(clients.map(c => c.user.ID)); // debugging
    console.log("client  close");

  }

  function onMessage(senderClient, reqObj) {
    if (!reqObj || !reqObj.otherClientID) {
      return senderClient.send('{"error": "Bad request"}');
    }

    const senderID = senderClient.user.ID;
    const receiverID = reqObj.otherClientID;

    console.log(senderID, "=>", receiverID); // debugging
    console.log(reqObj.message, '\n'); // debugging

    reqObj.otherClientID = senderID;

    const receiverClient = clients.find(
      c => c.user.ID === receiverID
    );

    if (receiverClient) {
      Db.saveMessageToDb(senderID, receiverID, reqObj.message, 0);
      return receiverClient.send(JSON.stringify(reqObj));
    }
    else {
      Db.saveMessageToDb(senderID, receiverID, reqObj.message, 1);
      console.log("client " + receiverID + " not connected");
      return;
    }
  }

  handler = new ConnectionHandler(onOpenSocket, onCloseSocket, onMessage);
  wss.on("connection", handler.handle);
}
main();