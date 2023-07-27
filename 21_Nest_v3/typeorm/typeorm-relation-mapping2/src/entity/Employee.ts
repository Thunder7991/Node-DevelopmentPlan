import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Department } from "./Department";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        length:50
    })
    name:string;

    //一对多 的映射和关联
    @ManyToOne(() => Department,{
        // cascade:true //自动保存 Department
        onDelete: 'CASCADE', //此时不需要自己删除 employee, 会把关联记录同时删除 , 或者把他们的外键id置为空
    })
    @JoinColumn({
        name:'d_id'
    })
    department:Department;

}
