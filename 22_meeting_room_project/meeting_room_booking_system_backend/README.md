前端使用 create-react-app 脚手架创建项目，使用 react + antd 开发页面。

使用 nginx 来网关层，实现静态资源的托管，并且对于动态资源请求做负载均衡。

使用 Nest 开发后端业务逻辑，使用 TypeORM + mysql 来做 CRUD。

使用 Redis 来做缓存，减轻数据库的压力，提高响应性能。

api 文档使用 Swagger 来生成。

部署使用 Docker Compose 的方式。

PM2 可用可不用，不用 PM2 就要启动容器的时候指定重启策略


### SQL
```sql
START TRANSACTION
query: INSERT INTO `permissions`(`id`, `code`, `description`) VALUES (DEFAULT, ?, ?) -- PARAMETERS: ["ccc","访问 ccc 接口"]
query: INSERT INTO `permissions`(`id`, `code`, `description`) VALUES (DEFAULT, ?, ?) -- PARAMETERS: ["ddd","访问 ddd 接口"]
query: COMMIT
query: START TRANSACTION
query: INSERT INTO `roles`(`id`, `name`) VALUES (DEFAULT, ?) -- PARAMETERS: ["管理员"]
query: INSERT INTO `roles`(`id`, `name`) VALUES (DEFAULT, ?) -- PARAMETERS: ["普通用户"]
query: INSERT INTO `role_permissions`(`rolesId`, `permissionsId`) VALUES (?, ?), (?, ?), (?, ?) -- PARAMETERS: [1,1,1,2,2,1]
query: COMMIT
query: START TRANSACTION
query: INSERT INTO `users`(`id`, `username`, `password`, `nick_name`, `email`, `headPic`, `phoneNumber`, `isFrozen`, `isAdmin`, `createTime`, `updateTime`) VALUES (DEFAULT, ?, ?, ?, ?, DEFAULT, ?, DEFAULT, ?, DEFAULT, DEFAULT) -- PARAMETERS: ["zhangsan","96e79218965eb72c92a549dd5a330112","张三","xxx@xx.com","13233323333",1]
query: SELECT `User`.`id` AS `User_id`, `User`.`isFrozen` AS `User_isFrozen`, `User`.`isAdmin` AS `User_isAdmin`, `User`.`createTime` AS `User_createTime`, `User`.`updateTime` AS `User_updateTime` FROM `users` `User` WHERE `User`.`id` = ? -- PARAMETERS: [3]
query: INSERT INTO `users`(`id`, `username`, `password`, `nick_name`, `email`, `headPic`, `phoneNumber`, `isFrozen`, `isAdmin`, `createTime`, `updateTime`) VALUES (DEFAULT, ?, ?, ?, ?, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT) -- PARAMETERS: ["lisi","e3ceb5881a0a1fdaad01296d7554868d","李四","yy@yy.com"]
query: SELECT `User`.`id` AS `User_id`, `User`.`isFrozen` AS `User_isFrozen`, `User`.`isAdmin` AS `User_isAdmin`, `User`.`createTime` AS `User_createTime`, `User`.`updateTime` AS `User_updateTime` FROM `users` `User` WHERE `User`.`id` = ? -- PARAMETERS: [4]
query: INSERT INTO `user_roles`(`usersId`, `rolesId`) VALUES (?, ?), (?, ?) -- PARAMETERS: [3,1,4,2]
query: COMMIT



ALTER TABLE `users` ADD UNIQUE INDEX `IDX_fe0bb3f6520ee0469504521e71` (`username`)
```