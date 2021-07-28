import oracledb from "oracledb";
import { createConnection, getConnection } from "typeorm";
import getDBHost from "./db-host";
export let Pool: oracledb.Pool;
export async function initDB() {
  console.log(process.env["DB_USER"], process.env["DB_PASSWORD"]);
  Pool = await oracledb.createPool({
    user: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    connectionString: `${getDBHost()}/${process.env["SID"]}`,
  });
  console.log("DB connected successfully");
}