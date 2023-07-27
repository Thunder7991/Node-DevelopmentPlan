import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "thunderchen",
    database: "practice",
    synchronize: true, //同步创建表。而创建表的依据就是 Entity
    logging: true,
    entities: ['./**/entity/*.ts'], //entities 是指定有哪些和数据库的表对应的 Entity。
    migrations: [],
    subscribers: [],
    connectorPackage: 'mysql2', //指定用什么驱动包。
    poolSize:10, //数据库连接池中连接的最大数量。
    extra: { //额外发送给驱动包的一些选项。
        authPlugin: 'sha256_password',
    }

})
