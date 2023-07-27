import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './Article';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;
  //第二个参数指定外键列在哪里
  @ManyToMany(() => Article,(article) => article.tags)
  articles:Article[]
}
