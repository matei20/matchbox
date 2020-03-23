const WebSocket = require("ws");

const ConnectionHandler = require("./handler");
const usersDb = require("./usersDb");

const wss = new WebSocket.Server({ port: 5000 });
const clients = [];

function onOpenSocket(client) {
  if (!client.user) {
    client.send('{"error": "Unauthenticated"}');
    return client.close();
  }

  clients.push(client);

  console.log(clients.map(c => c.user.ID)); // debugging

  // if (client.user.storedMessages.length) {
  //   let reqObj;
  //   while ((reqObj = client.user.storedMessages.shift()))
  //     client.send(JSON.stringify(reqObj));
  //   usersDb.saveOne(client.user);
  // }
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
  console.log(reqObj.text, '\n'); // debugging

  reqObj.otherClientID = senderID;
  //reqObj.otherClientEmoji = senderClient.user.emoji;

  const receiverClient = clients.find(
    c => c.user.ID === receiverID
  );

  if (receiverClient) {
    return receiverClient.send(JSON.stringify(reqObj));
  }

  // const receiverUser = usersDb.findOne({ username: receiverUsername });
  // if (receiverUser) {
  //   receiverUser.storedMessages.push(reqObj);
  //   return usersDb.saveOne(receiverUser);
  // }

  senderClient.send('{"error": "User not found"}');
  console.log(reqObj);
}

handler = new ConnectionHandler(onOpenSocket, onCloseSocket, onMessage);
wss.on("connection", handler.handle);
