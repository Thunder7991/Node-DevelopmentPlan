/*
 * @Author: thunderchen
 * @Date: 2023-05-28 16:05:35
 * @LastEditTime: 2023-05-28 16:05:45
 * @email: 853524319@qq.com
 * @Description:发送消息
 */

import { methodV } from '@/utils/request';
export enum RECEIVE_TYPE {
  'open_id',
  'user_id',
  'union_id',
  'email',
  'chat_id',
}

export enum MSG_TYPE {
  text,
  post,
  image,
  file,
  audio,
  media,
  sticker,
  interactive,
  share_chat,
  share_user,
}

type MESSAGES_PARAMS = {
  receive_id: string;
  content: string;
  msg_type: MSG_TYPE;
};

export const message = async (
  receive_id_type: RECEIVE_TYPE,
  params: MESSAGES_PARAMS,
  app_token: string,
) => {
  console.log(42, receive_id_type, params, app_token);


  const { data } = await methodV({
    url: `/im/v1/messages`,
    method: 'POST',
    query: { receive_id_type },
    params,
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });


  return data;
};
