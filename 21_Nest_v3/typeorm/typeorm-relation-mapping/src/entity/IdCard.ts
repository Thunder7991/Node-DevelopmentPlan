import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity({
    name: 'id_card'
})
export class IdCard {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        length: 50,
        comment: '身份证号'
    })
    cardName:string
    // @JoinColum 也就是外键列在 IdCard 对应的表里维护
    @JoinColumn()
    //指定它和 User 是 @OneToTone 一对一的关系。
    @OneToOne(() => User,{
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
        //cascade 不是数据库的那个级联，而是告诉 typeorm 当你增删改一个 Entity 的时候，是否级联增删改它关联的 Entity。
        cascade:true
    })
    user:User

}
