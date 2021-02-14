import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import WebSocket from "ws";

import authRouter from "./routers/auth";
import userRouter from "./routers/user";
import { authenticateUserForWS } from "./middlewares/authenticateUser";
import Message from "./models/message";

//to configure the environment variables
require("dotenv").config();

const server = express();

const PORT = process.env.PORT || 8080;

//middlewars
server.use(express.json());
server.use(cookieParser());
server.use(express.static(path.resolve(__dirname, "../build")));
server.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

//routers
server.use("/auth", authRouter);
server.use("/user", userRouter);

//servering the index.html file
server.get("/*", (request, response) => {
  response.sendFile(path.resolve("./build/index.html"));
});

// db connection
mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) console.log(err);
  }
);

const serverWs = server.listen(PORT, () =>
  console.log(`waiting on port ${PORT}`)
);

// handling web socket connection
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("new connection");

  ws.on("message", async (packet) => {
    let parsedPacket = JSON.parse(packet);

    if (parsedPacket.type != "message") {
      wss.clients.forEach((client) => client.send(packet));
      return;
    }

    try {
      parsedPacket.data.sentDate = new Date();
      // saving the message to db
      let savedMessage = await Message.create(parsedPacket.data);

      //adding the message type
      parsedPacket = JSON.stringify({ type: "message", data: savedMessage });

      // sending it to all other connected users
      function handle(client) {
        if (client.readyState !== WebSocket.OPEN) return;
        client.send(parsedPacket);
      }
      wss.clients.forEach(handle);
    } catch (e) {
      // handle errors
      console.log(e);
    }
  });

  ws.on("close", () => console.log("disconnected"));
});

serverWs.on("upgrade", function upgrade(request, socket, head) {
  if (request.url != "/chat-room") {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
    socket.destroy();
    return;
  }

  authenticateUserForWS(request, (err, user) => {
    if (err || user == null) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
    } else {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit("connection", ws, request, user);
      });
    }
  });
});
