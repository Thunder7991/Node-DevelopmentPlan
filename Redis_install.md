## 安装redis


测试机centos8.5,使用dnf命令安装时版本是5.0, 为了使用最新的redis软件, 需要从源代码编译并安装Redis


#### 准备Redis安装包的下载路径

```shell
cd /usr/local/src/
```
#### 下载Redis的安装包
先切换到src目录,从Redis下载站点获取最新稳定版本Redis的源文件
```shell
cd /usr/local/src/
wget https://download.redis.io/redis-stable.tar.gz
```
#### 解压
```shell
tar -xzvf redis-stable.tar.gz
#重命名
mv redis-stable redis
```
> 注：我这里下载的是redis-stable，可能和你下载的不同，请注意修改文件名
#### 进入Redis目录
```shell
cd redis
```
> 注：不同版本的Redis目录不一样，注意版本号
#### 执行make
```shell
make
```
执行完毕后
#### 执行make install
首先进入src目录
```shell
cd /usr/local/src/redis/src
```
然后执行make install
```shell
make install PREFIX=/usr/local/redis
```
> 注：PREFIX是安装目录，我这里设置的是/usr/local/redis, 你可以自定义这个目录。
执行完毕后，执行成功后，会输出以下信息
```
Hint: It's a good idea to run 'make test' ;)

    INSTALL redis-server
    INSTALL redis-benchmark
    INSTALL redis-cli

```
#### 增加环境变量
编辑/etc/profile这个文件，在这个文件最后新增如下信息
```
export REDIS_HOME=/usr/local/redis
export PATH=$PATH:$REDIS_HOME/bin
```
> 注：REDIS_HOME是根据你之前设置的PREFIX来生成的，所以要根据你之前设置的PREFIX来修改这个变量。
然后执行
```shell
source /etc/profile
```
#### 执行install_server.sh
```
cd /usr/local/src/redis/utils/

./install_server.sh
```
安装时会报错
```
This script will help you easily set up a running redis server

This systems seems to use systemd.
Please take a look at the provided example service unit files in this directory, and adapt and install them. Sorry!
```
如果遇到如上报错信息，可以将install_server.sh脚本的如下内容注释掉
```
#_pid_1_exe="$(readlink -f /proc/1/exe)"
#if [ "${_pid_1_exe##*/}" = systemd ]
#then
# echo "This systems seems to use systemd."
# echo "Please take a look at the provided example service unit files in this directory, and adapt and install them. Sorry!"
# exit 1
#fi
#unset _pid_1_exe
```
注释掉以后，重新执行
```shell
./install_server.sh
```
一路Enter
最后显示了Installation successful!

即表示安装成功。

#### 验证

执行如下命令:
```shell
ps -ef|grep redis
```
显示redis一个实例正在运行
```
root      991877       1  0 02:22 ?        00:01:32 /usr/local/bin/redis-server 0.0.0.0:6379
```
执行：redis-cli
```shell
redis-cli
```

```
127.0.0.1:6379> info server
# Server
redis_version:7.0.7
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:f465ee2fac853749
...
```
响应
```
127.0.0.1:6379> keys *
1) "k1"
127.0.0.1:6379> ping
PONG

```
#### 链接不同的服务器redis(略过)

```shell
#例如:
redis-cli -h  127.0.0.1 -p 端口号
```

#### 查看redis服务器运行状态
```shell
info server
```
#### 远程连接Redis
修改redis服务器的配置文件
```shell
vi /etc/redis/6379.conf
```

注释以下绑定的主机地址
```shell
# bind 127.0.0.1
```
或配置为：
```shell
bind  0.0.0.0
```
然后把如下配置设置为no
```shell
protected-mode   no
```
重启Redis
```shell
systemctl restart redis
```
#### 添加防火墙
```shell
firewall-cmd --zone=public --add-port=6379/tcp --permanent
```
重启防火墙
```shell
systemctl restart  firewalld
```












