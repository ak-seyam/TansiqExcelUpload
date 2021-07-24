import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Student {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  name: string;
  @Column()
  mark: number;
}
