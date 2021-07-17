import { Eureka } from "eureka-js-client";
import express from "express";
import PingRouter from "./routes/ping";

// start express app here

async function main() {
  const app = express();
  if (!process.env.PORT) {
    throw new Error("Port is not provided");
  }
  if (!process.env.EUREKA_PORT) {
    throw new Error("Eureka port is not provided");
  }
	app.use(PingRouter);

  app.listen(parseInt(process.env.PORT), () => {
    console.log("listening on port" + process.env.PORT);
    const client = new Eureka({
      eureka: {
        host: process.env.EUREKA_HOST ?? "localhost",
        port: parseInt(process.env.EUREKA_PORT!),
        servicePath: "/eureka/apps/",
      },
      instance: {
        app: "excel-uploader",
        hostName: "localhost",
        ipAddr: "127.0.0.1",
        port: { $: parseInt(process.env.PORT!), "@enabled": true },
        vipAddress: "excel-uploader",
        dataCenterInfo: {
          name: process.env.NODE_ENV === "production" ? "Amazon" : "MyOwn",
          "@class":
            process.env.NODE_ENV === "production"
              ? "com.netflix.appinfo.AmazonInfo"
              : "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        },
      },
    });

    client.start();
  });
}

main();
