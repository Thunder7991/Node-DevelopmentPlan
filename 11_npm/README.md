## 发布npm包

#### 查看npm配置
```shell
npm config list -l --json
```
打印得
```
  "prefix": "E:\\nodejs\\node_global",
  "cache": "E:\\nodejs\\node_cache",
  "registry": "https://registry.npmmirror.com/",
  "msvs_version": "2017",
  "access": null,
  ```
> 必须保证是官方的镜像源

#### 设置镜像源
```shell
npm config set registry "https://registry.npmjs.org/"
```

#### 登录
```shell
npm login
```
此时你需要输入一系列的信息

...

#### 发布

发布之前需要检查npm包中是否有当前包 , 如果有需要再次修改 `package.json` 中的`name`字段 。

`version`版本号:
```shell
# 更改最后版本号
npm version patch
#v0.0.2

# 更改该中间版本号
npm version minor
#v0.1.0

# 更改大版本号
npm version major
#v1.0.0
```

在当前项目目录中输入指令:`npm publish` 即可发布成功! So easy~~




