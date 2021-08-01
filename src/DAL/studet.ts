import { randomUUID } from "crypto";
import { Pool } from "../../utils/database-connection";
import Student from "../models/student";
import bcrypt from "bcrypt";
export async function createStudent(s: Student) {
  const con = await Pool.getConnection();
  const id = randomUUID();
  const insertedId = id.replace(/-/g, "");
  const returnedStudent: Student = {
    id: insertedId,
    name: s.name,
    mark: s.mark,
    email: s.email,
    password: await bcrypt.hash(s.password, 12),
  };
  try {
    await con.execute(
      `INSERT INTO STUDENT (ID, NAME, MARK, EMAIL, PASSWORD) VALUES (:id, :name, :mark, :email, :password)`,
      { ...returnedStudent }
    );
    await con.commit();
  } catch (e) {
    console.error(e);
  }
  return returnedStudent;
}

export async function intoCreator( s: Student) {
  const id = randomUUID();
  const insertedId = id.replace(/-/g, "");
  const returnedStudent: Student = {
    id: insertedId,
    name: s.name,
    mark: s.mark,
    email: s.email,
    password: await bcrypt.hash(s.password, 12),
  };
	//    INTO t (col1, col2, col3) VALUES ('val1_1', 'val1_2', 'val1_3')

	return `INTO STUDENT (ID, NAME, MARK, EMAIL, PASSWORD) VALUES (${returnedStudent.id}, ${returnedStudent.name}, ${returnedStudent.mark}, ${returnedStudent.email}, ${returnedStudent.password})`
}