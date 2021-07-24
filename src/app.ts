import express from "express";
import PingRouter from "./routes/ping";
import ReciverRouter from "./routes/receiver";
import client from "./services/eurekaClientGenerator";

// start express app here

async function main() {
  const app = express();
  if (!process.env.PORT) {
    throw new Error("Port is not provided");
  }
  if (!process.env.EUREKA_PORT) {
    throw new Error("Eureka port is not provided");
  }
  app.use(express.json());
  app.use(PingRouter);
  app.use("/studentsFiles", ReciverRouter);

  app.listen(parseInt(process.env.PORT), () => {
    console.log("listening on port" + process.env.PORT);
    client.start();
  });
}

main();
