<!--
 * @Author: thunderchen
 * @Date: 2023-01-08 23:10:11
 * @LastEditTime: 2023-01-08 23:47:49
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