import { AppDataSource } from "./data-source"
import { IdCard } from "./entity/IdCard"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.age = 25
     //修改需要添加Id
    user.id = 11

    const idCard = new IdCard()
     //修改需要添加Id
    idCard.id =1
    idCard.cardName  = "111"
    idCard.user = user
   
    // cascade:true 为true 不需要保存 user
    // await AppDataSource.manager.save(user);
    await AppDataSource.manager.save(idCard);

    const ics = await AppDataSource.manager.find(IdCard,{
        relations: { //关联
            user: true
        }
    });
    console.log(ics);

    //如果使用 query builder 查询
    const queryBuilderIcs = await AppDataSource.manager.getRepository(IdCard)
    .createQueryBuilder("ic")
    .leftJoinAndSelect("ic.user","u")
    .getMany();
    console.log(32,queryBuilderIcs);

    //或者
    const icss = await AppDataSource.manager.createQueryBuilder(IdCard, "ic")
    .leftJoinAndSelect("ic.user", "u")
    .getMany();

   

    //删除
    await AppDataSource.manager.delete(User,1);

    // 如果不是没有这种级联删除，就需要手动删了：
    // const idCard = await AppDataSource.manager.findOne(IdCard, {
    //     where: {
    //         id: 1
    //     },
    //     relations: {
    //         user: true
    //     }
    // })
    // await AppDataSource.manager.delete(User, idCard.user.id)
    // await AppDataSource.manager.delete(IdCard, idCard.id)

   //查询User 获取idcard
//    const user = await AppDataSource.manager.find(User, {
//     relations: {
//         idCard: true
//     }
// });
// console.log(user);
}).catch(error => console.log(error))
