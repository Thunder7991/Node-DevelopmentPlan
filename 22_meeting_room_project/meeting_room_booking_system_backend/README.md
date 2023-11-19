前端使用 create-react-app 脚手架创建项目，使用 react + antd 开发页面。

使用 nginx 来网关层，实现静态资源的托管，并且对于动态资源请求做负载均衡。

使用 Nest 开发后端业务逻辑，使用 TypeORM + mysql 来做 CRUD。

使用 Redis 来做缓存，减轻数据库的压力，提高响应性能。

api 文档使用 Swagger 来生成。

部署使用 Docker Compose 的方式。

PM2 可用可不用，不用 PM2 就要启动容器的时候指定重启策略