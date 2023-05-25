import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
} from 'typeorm';

@Entity()
export class Mysql {
  //获取uuid ,只需传入 uuid 即可
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column()
  password: string;

  @Column()
  age: number;
  @CreateDateColumn({
    type: 'timestamp',
  })
  createTime: Date;

  @Generated('uuid')
  uuid: string;
  @Column({
    type: 'enum',
    enum: [1, 2, 3],
    default: 1,
    select: true, //不会返回给用户
    comment: '注释', //
  })
  thunder: number;

  @Column('simple-array')
  names: string[];
  @Column('simple-json')
  json: { name: string; age: number };
}
