import { EurekaClient } from "eureka-js-client";
import { Router } from "express";
import client from "../services/eurekaClientGenerator";
import { download } from "../services/fileDownloader";

const router = Router();

router.post("/", async (req, res) => {
  const url = req.body["fileUrl"];
  const studentsNameColumnName = req.body["studentsNameColumnName"];
  const studentsMarkColumnName = req.body["studentsMarkColumnName"];
  console.log(url, studentsMarkColumnName, studentsNameColumnName);
  if (!process.env["FILE_STORAGE"]) {
    throw new Error("File storage is not correct");
  }
  // get the instance
  let splittedUrl: string[] = url.split("/");
  const serviceName = splittedUrl[2];
  const instance = client.getInstancesByAppId(serviceName)[0];
  const port = (instance.port as EurekaClient.LegacyPortWrapper)["$"];
  splittedUrl[2] = `${instance.ipAddr}:${port}`;
  const downloadUrl = splittedUrl.join("/");
  console.log("download url", downloadUrl);
  download(downloadUrl, process.env["FILE_STORAGE"], ".csv")
    .then(() => {
      // get file name
      // read the csv file
    })
    .catch((err) => {
      throw err;
    });
  res.send({
    success: true,
  });
});

export default router;
