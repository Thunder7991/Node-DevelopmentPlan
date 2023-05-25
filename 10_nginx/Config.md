<!--
 * @Author: thunderchen
 * @Date: 2023-01-09 21:08:10
 * @LastEditTime: 2023-01-10 21:27:21
 * @email: 853524319@qq.com
 * @description: Nginx配置选项
-->
```shell
    Main # 全局配置区, Nginx核心功能配置
    user **; # 启动nginx的账户
    worker_processes auto; #允许开启worker数量，一般会和cup核数相等，会根据操作系统自动选择配置
    pid /run/nginx.pid; #pid 文件路径
    include **; #引入外部配置文件(配置文件都会起作用)
    events{ # events 事件区 , 子进程核心配置
        worker_connections 768;# 每个worker进程支持的最大连接数(可以处理768的并发数)
    }
    http { # http 服务器配置区
        sendfile on; # 是否去调用系统的sendfile文件
        # 负载均衡
        upstream test {
            server test1.example.com  weight=1 max_fails=3 fail_timeout=30s; #max_fails:最大失败次数, weight:权重 , server: 指定 upstream成员
            server test2.example.com;
            server test3.example.com backup;  # backup: 备份
        }

        tcp_nopush on;# nginx处理链接时,是否开启数据包累积 , 一起传输,提高效率

        tcp_nodelay on; # 最小数据包是否等待

        keeplive_timeout:65; # 链接超时时间单位秒

        include ***/mime.types; # 支持文件类型

        defalut_type application/octet-stream; #上述mime都没有找到返回二进制流类型

        ssl *
        access_log *; #日志信息
        error_log *; #错误日志信息

        gzip on ; #gzip 压缩
        gzip_min_length 1k;
        gzip_comp_level 6;
        gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/xml text/javascript application/json;
        gzip_vary on;
        gzip_buffers 4 16k;
        gzip_http_version 1.1;

        # Server配置选项
        include /etc/nginx/conf.d/*conf;
        include /etc/nginx/sites-enabled/*; # 默认配置 80 端口


        server { # 不同服务配置区
            root **; # 路径
            index index.html # 目标文件
            location / { # location 不同请求路径配置区
                # 具体配置选项
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $_adr;
                #在原有的X-Forwarded-For字段值上追加当前服务器的IP地址
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                 # 请求交给名为nginx_boot的upstream上
                proxy_pass:http://test; # 需要和upstream 命名相同
                
                
            }            
        }
    }
    main { # 邮件代理配置区
        server { # 邮件服务配置区
            # 具体配置选项
        }
    }
```






