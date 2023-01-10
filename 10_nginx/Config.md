<!--
 * @Author: thunderchen
 * @Date: 2023-01-09 21:08:10
 * @LastEditTime: 2023-01-09 21:38:37
 * @email: 853524319@qq.com
 * @description: Nginx配置选项
-->
```shell
    Main # 全局配置区, Nginx核心功能配置
    events{ # events 事件区 , 子进程核心配置
    }
    http { # http 服务器配置区
        server { # 不同服务配置区
            location { # location 不同请求路径配置区
                # 具体配置选项
            }            
        }
    }
    main { # 邮件代理配置区
        server { # 邮件服务配置区
            # 具体配置选项
        }
    }
```


