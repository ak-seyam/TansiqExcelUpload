import axios from "axios";
import { promises } from "fs";
import { createWriteStream } from "fs";
import { promisify } from "util";
import * as stream from "stream";
import fileNameExtractor from "./fileNameExatractor";

const mkdir = promises.mkdir;
const finished = promisify(stream.finished);

export type SuitableFormat = ".csv";

export async function download(
  url: string,
  savingPath: string,
  format: SuitableFormat
) {
  // await mkdir(`${__dirname}/../${process.env["FILE_STORAGE"]}`);
  await mkdir(savingPath, { recursive: true });

  // get the filename
  const filename = fileNameExtractor(url);
  if (!filename?.endsWith(format)) {
    throw new Error("only csv files are available");
  }
  // store the file in storage
  const writer = createWriteStream(`${savingPath}/${filename}`);
  return axios({
    method: "GET",
    url,
    responseType: "stream",
  }).then((res) => {
    res.data.pipe(writer);
    return finished(writer);
  });
}
