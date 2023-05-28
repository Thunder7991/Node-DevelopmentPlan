/*
 * @Author: thunderchen
 * @Date: 2023-05-28 14:28:58
 * @LastEditTime: 2023-05-28 18:06:51
 * @email: 853524319@qq.com
 * @Description: 环境变量
 */

import { getConfig } from '@/utils';

const { FEISHU_CONFIG } = getConfig();

export const APP_ID = FEISHU_CONFIG.FEISHU_APP_ID;
export const APP_SECRET = FEISHU_CONFIG.FEISHU_APP_SECRET;
export const APP_TOKEN_CACHE_KEY = FEISHU_CONFIG.APP_TOKEN_CACHE_KEY;
