/*
 * @Author: thunderchen
 * @Date: 2023-05-28 13:54:16
 * @LastEditTime: 2023-05-28 17:14:39
 * @email: 853524319@qq.com
 * @Description:两种请求方法，一种是植入飞书请求的版本，另一种是自由请求
 */

import axios, { Method } from 'axios';
import { getConfig } from './index';
const {
  FEISHU_CONFIG: { FEISHU_URL },
} = getConfig();

// 任意请求

const request = async ({ url, option = {} }) => {
  try {
    return axios.request({
      url,
      ...option,
    });
  } catch (error) {
    throw error;
  }
};

interface IMethodV {
  url: string;
  method?: Method;
  headers?: { [key: string]: string };
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

export interface IRequest {
  data: any;
  code: number;
}

/**
 * @description: 带 version 的通用 api 请求
 */
const methodV = async ({
  url,
  method,
  headers,
  params = {},
  query = {},
}: IMethodV): Promise<IRequest> => {
  let sendUrl = '';
  if (/^(http:\/\/|https:\/\/)/.test(url)) {
    sendUrl = url;
  } else {
    sendUrl = `${FEISHU_URL}${url}`;
  }
  try {
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...headers,
        },
        url: sendUrl,
        method,
        params: query,
        data: {
          ...params,
        },
      })
        .then(({ data, status }) => {
          resolve({ data, code: status });
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    throw error;
  }
};

export { request, methodV };
