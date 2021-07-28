import { randomUUID } from "crypto";
import { Pool } from "../../utils/database-connection";
import Student from "../models/student";
export async function createStudent(s: Student) {
  const con = await Pool.getConnection();
  const id = randomUUID();
  const insertedId = id.replace(/-/g, "");
  const returnedStudent: Student = {
    id: insertedId,
    name: s.name,
    mark: s.mark,
  };
  try {
    await con.execute(
      `INSERT INTO STUDENT (ID, NAME, MARK) VALUES (:id, :name, :mark)`,
      { ...returnedStudent }
    );
    await con.commit();
  } catch (e) {
		console.error(e);
  }
  return returnedStudent;
}
