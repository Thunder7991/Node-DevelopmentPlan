import { AppDataSource } from "./data-source"
import { Article } from "./entity/Article"
import { Tag } from "./entity/Tag"
import { User } from "./entity/User"
// 多对多
AppDataSource.initialize().then(async () => {

    const a1 = new Article();
    a1.title = 'aaaa';
    a1.content = 'aaaaaaaaaa';

    const a2 = new Article();
    a2.title = 'bbbbbb';
    a2.content = 'bbbbbbbbbb';

    const t1 = new Tag();
    t1.name = 'ttt1111';

    const t2 = new Tag();
    t2.name = 'ttt2222';

    const t3 = new Tag();
    t3.name = 'ttt33333';

    a1.tags = [t1,t2];
    a2.tags = [t1,t2,t3];

    const entityManager = AppDataSource.manager;

    await entityManager.save(t1);
    await entityManager.save(t2);
    await entityManager.save(t3);

    await entityManager.save(a1);
    await entityManager.save(a2);

    const article = await entityManager.find(Article,{
        relations:{
            tags:true
        }
    })

    console.log(article);
    console.log(article.map(item=> item.tags))

    //可以使用 query builder 来join 查询
    //使用 'a' 作为 Article 实体的别名
    const articleBuilder = await entityManager.createQueryBuilder(Article,"a")
    //进行左连接，并加载关联实体 Tag
    .leftJoinAndSelect("a.tags","t")
    .getMany();
    
    console.log(articleBuilder);

    //或者 先拿到Article的Repository 在创建query builder来查询也行
    const articleNext =await entityManager.getRepository(Article)
    .createQueryBuilder('a')
    .leftJoinAndSelect('a.tags','t')
    .getMany();
    console.log(60,articleNext);
    
    // id 为 2 的文章的标签只保留包含 111 的，并且还改了标题：
    const articleFindOne = await entityManager.findOne(Article,{
        where:{
            id:2,
        },
        relations:{
            tags:true //否同时加载实体之间的关联数据。
        }
    })
    articleFindOne.title = "ccc"

    articleFindOne.tags = articleFindOne.tags.filter(item => item.name.includes("ttt111"))
    
    await entityManager.save(articleFindOne)

    //删除
    //主键值
    await entityManager.delete(Article,1)
    await entityManager.delete(Tag,1)


    //
    const tags = await entityManager.find(Tag,{
        relations:{
            articles:true
        }
    })
    console.log(tags);

}).catch(error => console.log(error))
