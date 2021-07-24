import { Eureka } from "eureka-js-client";

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

export default client;