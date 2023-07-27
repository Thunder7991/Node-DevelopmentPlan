import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  name: string;
  //第二个参数指定外键列在 employee.department 维护。
  @OneToMany(
    () => Employee,
    (employee) => employee.department,
    { cascade: true },
  )
  employee: Employee[];
}
