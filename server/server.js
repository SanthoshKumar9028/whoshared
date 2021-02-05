import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth";
import userRouter from "./routers/user";

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

const wsServer = server.listen(PORT, () =>
  console.log(`waiting on port ${PORT}`)
);
