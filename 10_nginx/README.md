<!--
 * @Author: thunderchen
 * @Date: 2023-01-08 23:10:11
 * @LastEditTime: 2023-01-10 20:26:01
 * @email: 853524319@qq.com
 * @description: nginx常用指令 / 配置说明
-->
## 停止运行
```shell
[root@chen nginx]# nginx -s stop  
```
> 或者systemctl stop nginx

查看nignx端口, 发现没有nginx端口占用,说明已经停止
```shell
[root@chen nginx]# netstat -tupln | grep 80
tcp6       0      0 :::8080                 :::*                    LISTEN      1337/java 
```

### 优雅停止 quit

```shell
[root@chen nginx]# nginx -s quit
[root@chen nginx]# netstat -tupln | grep 80
tcp6       0      0 :::8080                 :::*                    LISTEN      1337/java   
```

## 启动
直接输入`nginx`即可
```shell
[root@chen nginx]# nginx
```
> systemctl start nginx
> 
查看nignx端口
```shell
[root@chen nginx]# netstat -tupln | grep 80
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      72879/nginx: master 
tcp6       0      0 :::8080                 :::*                    LISTEN      1337/java    
```
## 日志文件操作

修改access.log文件名称
```shell
[root@chen nginx]# mv access.log 22.log
[root@chen nginx]# 
```
再次创建access.log
```shell
[root@chen nginx]# touch access.log
```
再次发起请求(访问服务器页面),查看`22.log`和`access.log`,
发现`access.log`并没有记录相关日志,还是继续在`22.log`进行记录,
因此我们需要重新按照配置文件写入日志:
```shell
[root@chen nginx]# nginx -s reopen
```

## 重新加载配置文件

检测配置文件是否正确: 
```shell
[root@chen nginx]# nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

重新加载
```shell
[root@chen nginx]# nginx -s reload
```
## 问题
当优雅的停止nginx的时候`nginx -s quit` , 此时访问相关服务是正常的,但是查看nginx的状态 `systemctl status nginx` , 提示未启动如下:
```
 nginx.service - nginx - high performance web server
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; vendor preset: >
   Active: failed (Result: exit-code) since Mon 2023-01-09 21:56:15 CST; 21min ago
     Docs: http://nginx.org/en/docs/
  Process: 160188 ExecStart=/usr/sbin/nginx -c /etc/nginx/nginx.conf (code=exited,>
 Main PID: 1331 (code=exited, status=0/SUCCESS)
 ```
 启动nginx`nginx start nginx` , 提示如下: 
```
nginx: [error] open() "/var/run/nginx.pid" failed (2: No such file or directory)
```
quit杀死进程后pid丢失了，下一次再开启start时无法启动 。
此时查看nginx进程`ps -ef | grep nginx` :
```
root       73836       1  0 Jan08 ?        00:00:00 nginx: master process nginx
root       74953   73836  0 Jan08 ?        00:00:00 nginx: worker process
root       74954   73836  0 Jan08 ?        00:00:00 nginx: worker process
root       74955   73836  0 Jan08 ?        00:00:00 nginx: worker process
root       74956   73836  0 Jan08 ?        00:00:00 nginx: worker process
root      162414  158351  0 22:13 pts/3    00:00:00 grep --color=auto nginx
```
使用kill命令将所有nginx进程删除:
```
Kill -9  73836
Kill -9  74953
... ...
```
重启nginx: `systemctl start nginx`。
查看nginx状态: `systemctl status nginx` :
```
Active: active (running) since Mon 2023-01-09 22:18:13 CST; 2s ago
```
## 基础配置
[配置说明](./Config.md)

## SSL配置
[配置说明](./SSL.md)
