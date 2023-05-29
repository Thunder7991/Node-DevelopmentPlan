import { Column, ObjectIdColumn } from 'typeorm';

//创建mongodb 实体
export class User {
  //自增主键
  @ObjectIdColumn()
  id?: number;

  @Column({ default: null })
  name: string;
}
