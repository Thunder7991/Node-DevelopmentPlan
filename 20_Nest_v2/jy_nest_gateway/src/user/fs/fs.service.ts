/*
 * @Author: thunderchen
 * @Date: 2023-05-28 15:10:29
 * @LastEditTime: 2023-05-28 18:10:25
 * @email: 853524319@qq.com
 * @Description: fs  业务逻辑
 */

import { Inject, Injectable } from '@nestjs/common';
import { getAppToken } from '../../../helper/fs/auth';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { BusinessException } from '@/common/exceptions/business.exception';
import { message } from 'helper/fs/messages';

@Injectable()
export class FsService {
  private APP_TOKEN_CACHE_KEY;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.APP_TOKEN_CACHE_KEY = this.configService.get('APP_TOKEN_CACHE_KEY');
  }
  async getAppToken() {
    let appToken: string;
    appToken = await this.cacheManager.get(this.APP_TOKEN_CACHE_KEY);
    console.log(31, appToken);

    if (!appToken) {
      const response = await getAppToken();
      console.log(33,response);

      if (response.code === 0) {
        appToken = response.app_access_token;
        this.cacheManager.set(
          this.APP_TOKEN_CACHE_KEY,
          appToken,
          response.expire - 60,
        );
      } else {
        throw new BusinessException('fs调用异常');
      }
    }
    return appToken;
  }

  async sendMessage(receive_id_type, params) {
    const app_token = await this.getAppToken();
    return message(receive_id_type, params, app_token as string);
  }
}
