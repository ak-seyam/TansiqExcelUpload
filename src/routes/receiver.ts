import { EurekaClient } from "eureka-js-client";
import { Router } from "express";
import client from "../services/eurekaClientGenerator";
import { download } from "../services/fileDownloader";
import fileNameExtractor from "../services/fileNameExatractor";
import { createReadStream } from "fs";
import CsvReadableStream from "csv-reader";
import Student from "../models/student";
import { createStudent } from "../DAL/studet";

const router = Router();

router.post("/", async (req, res) => {
  const url = req.body["fileUrl"];
  const studentsNameColumnName = req.body["studentsNameColumnName"];
  const studentsMarkColumnName = req.body["studentsMarkColumnName"];
  const studentsEmailColumnName = req.body["studentEmailColumnName"];
  const studentPasswordColumnName = req.body["studentPasswordColumnName"];
  let studentNameColumnIndex = -1;
  let studentMarkColumnIndex = -1;
	let studentEmailColumnIndex = -1;
	let studentPasswordColumnIndex = -1;
  let isFirstRow = true;
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
      const fileName = fileNameExtractor(downloadUrl);
      const filePath = `${process.env["FILE_STORAGE"]}/${fileName}`;
      // read the csv file
      let inputStream = createReadStream(filePath, "utf8");
      inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true }))
        .on("data", async (row: string[]) => {
          console.log("a row arrived", row);
          if (isFirstRow) {
            isFirstRow = false;
            row.forEach((col, idx) => {
              if (col === studentsNameColumnName) {
                studentNameColumnIndex = idx;
              } else if (col === studentsMarkColumnName) {
                studentMarkColumnIndex = idx;
              } else if (col === studentsEmailColumnName) {
								studentEmailColumnIndex = idx;
							} else if (col === studentPasswordColumnName) {
								studentPasswordColumnIndex = idx
							}
            });
          } else {
            // create a new student
            let s: Student = {
							id: "",
              mark: row[studentMarkColumnIndex],
              name: row[studentNameColumnIndex],
							email: row[studentEmailColumnIndex],
							password: row[studentPasswordColumnIndex]
            };
            // store it in the db
						const insertedStudent = await createStudent(s);
            console.log("student added to db", insertedStudent);
          }
        })
        .on("error", (err) => {
          throw err;
        })
        .on("end", () => {
          console.log("done!");
        });
    })
    .catch((err) => {
			console.error(err);
    });
  res.send({
    success: true,
  });
});

export default router;
