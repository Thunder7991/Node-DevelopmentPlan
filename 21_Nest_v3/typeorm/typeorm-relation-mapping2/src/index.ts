import { AppDataSource } from './data-source';
import { Department } from './entity/Department';
import { Employee } from './entity/Employee';

AppDataSource.initialize()
  .then(async () => {
    //   const d1 = new Department()
    //   d1.name = "技术部"

    //   const e1 = new Employee()
    //   e1.name = '张三';
    //   e1.department = d1;

    //   const e2 = new Employee();
    //   e2.name = '李四';
    //   e2.department = d1;

    //   const e3 = new Employee();
    //   e3.name = '王五';
    //   e3.department = d1;

    //   //自动级联保存。
    // //   await AppDataSource.manager.save(Department,d1)

    //   await AppDataSource.manager.save(Employee,[e1,e2,e3])

    const e4 = new Employee();
    e4.name = '张三';

    const e5 = new Employee();
    e5.name = '李四';

    const e6 = new Employee();
    e6.name = '王五';

    //只需要设置 department 的 employees 属性，然后 save 这个 department。
    const d2 = new Department();
    d2.name = '技术部';
    d2.employee = [e4, e5, e6];

    await AppDataSource.manager.save(Department, d2);

    const deps = await AppDataSource.manager.find(Department, {
      relations: {
        employee: true,
      },
    });

    const es = await AppDataSource.manager.getRepository(Department)
                .createQueryBuilder('d')
                .leftJoinAndSelect('d.employee','e')
                .getMany()
    console.log(45, es);

    //删除的话, 需要先把关联的employee 删除了, 在删除department
    const depsdel = await AppDataSource.manager.find(Department, {
        relations: {
            employee: true
        }
    });
    await AppDataSource.manager.delete(Employee, depsdel[0].employee);
    await AppDataSource.manager.delete(Department, depsdel[0].id);
  })
  .catch((error) => console.log(error));
