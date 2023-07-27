import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({
    name:'typeorm'
})
export class User {

    @PrimaryGeneratedColumn({
        comment:"这是自增主键ID"
    })
    id: number

    @Column(
        {
            name: 'a_aa',
            type: 'text',
            comment: '这是 aaa'
        }
    )
    aaa:string

    @Column({
        // unique: true, //UNIQUE 唯一索引
        nullable: false, //NOT NULL 约束
        length: 10,
        type: 'varchar',
        default: 'bbb'
    })
    bbb:string

    @Column({
        type: 'double',
    })
    ccc:string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

}
