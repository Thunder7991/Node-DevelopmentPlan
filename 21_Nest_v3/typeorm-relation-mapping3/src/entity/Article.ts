
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Tag } from "./Tag"

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        length:100,
        comment:"文章标题"
    })
    title:string

    @Column({
        type:'text',
        comment:"文章内容"
    })
    content:string

    @JoinTable() //指定关联表的配置 , 默认会关联 实体的主键
    @ManyToMany(() => Tag,(tag) => tag.articles)
    tags:Tag[]

}
