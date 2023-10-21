import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '文章名字',
    length: 50,
  })
  title: string;

  @Column({
    comment: '内容',
    type: 'text',
  })
  content: string;

  @Column({
    comment: '阅读量',
    default: 0,
  })
  viewCount: number;

  @Column({
    comment: '点赞量',
    default: 0,
  })
  likeCount: number;

  @Column({
    comment: '收藏量',
    default: 0,
  })
  collectCount: number;
}


// CREATE TABLE `article` (
//     `id` int NOT NULL AUTO_INCREMENT, 
//     `title` varchar(50) NOT NULL COMMENT '文章名字', 
//     `content` text NOT NULL COMMENT '内容',
//     `viewCount` int NOT NULL COMMENT '阅读量' DEFAULT '0',
//     `likeCount` int NOT NULL COMMENT '点赞量' DEFAULT '0', 
//     `collectCount` int NOT NULL COMMENT '收 藏量' DEFAULT '0', 
//     PRIMARY KEY (`id`)) ENGINE=InnoDB)