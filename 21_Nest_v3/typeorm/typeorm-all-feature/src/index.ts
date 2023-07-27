import { In } from 'typeorm';
import { AppDataSource } from './data-source';
import { User } from './entity/User';

AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...');
    // user.id = 1  //如果指定了 id 就变成修改了~
    // const user = new User()
    // user.firstName = "Timber"
    // user.lastName = "Saw"
    // user.age = 25
    // user.aaa ='1212'
    // user.ccc = '12.2'
    // await AppDataSource.manager.save(user)
    //1. 如果想批量插入
    await AppDataSource.manager.save(User, [
      {
        firstName: 'Timber',
        lastName: 'Saw',
        age: 25,
        aaa: '1212',
        ccc: '12.2',
      },
      {
        firstName: 'Timber',
        lastName: 'Saw',
        age: 25,
        aaa: '1212',
        ccc: '12.2',
      },
      {
        firstName: 'Timber',
        lastName: 'Saw',
        age: 25,
        aaa: '1212',
        ccc: '12.2',
      },
    ]);

    //2. 批量修改直接添加上id即可

    //3. 删除和批量删除用delete方法
    await AppDataSource.manager.delete(User, 1);
    await AppDataSource.manager.delete(User, [2, 3]);
    //4. remove 删除
    // delete 和 remove 的区别是，delete 直接传 id、而 remove 则是传入 entity 对象。
    const user = new User();
    user.id = 1;
    await AppDataSource.manager.remove(User, user);
    //5. 查询 find
    const users = await AppDataSource.manager.find(User);

    //6. 通过findBy 方法条件查询
    const usersFindBy = await AppDataSource.manager.findBy(User, {
      age: 23,
    });
    //7. findAndCount 获取多条记录
    const [usersCount, count] = await AppDataSource.manager.findAndCount(User);

    //8. findAndCountBy 条件查询
    const [usersCountBy, countBy] = await AppDataSource.manager.findAndCountBy(
      User,
      {
        age: 23,
      },
    );
    //9. 查询一条
    const userOne = await AppDataSource.manager.findOne(User, {
      select: {
        firstName: true,
        age: true,
      },
      where: {
        id: In([4, 8]),
      },
      order: {
        age: 'ASC',
      },
    });
    //10. 按照条件查询一条
    const userOneBy = await AppDataSource.manager.findOneBy(User, {
      age: 23,
    });
    //11. findOne 还有两个特殊的方法
    try {
      const user = await AppDataSource.manager.findOneOrFail(User, {
        where: {
          id: 666,
        },
      });
    } catch (error) {
      console.log(error);
      console.log('没找到该用户');
    }
    //12. query 直接执行sql语句
    const usersQuery = await AppDataSource.manager.query(
      'select * from user where age in(?, ?)',
      [21, 22],
    );
    console.log(usersQuery);
    //13. query builder
    const userQueryBuilder = await AppDataSource.manager
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.age = :age', { age: 21 })
      .getOne();

    //14. 开启事务
    await AppDataSource.manager.transaction(async (manager) => {
      let repositor = AppDataSource.manager.getRepository(User);
      await repositor.save({
        id: 4,
        firstName: 'eee',
        lastName: 'eee',
        age: 20,
      });

      await repositor.save(
        [{
          id: 4,
          firstName: 'eee',
          lastName: 'eee',
          age: 20,
        },
        {
          id: 5,
          firstName: 'eee',
          lastName: 'eee',
          age: 20,
        }]
      );

      await repositor.delete(1)
      await repositor.delete([2,3])

    });

    console.log(
      'Here you can setup and run express / fastify / any other framework.',
    );
  })
  .catch((error) => console.log(error));
