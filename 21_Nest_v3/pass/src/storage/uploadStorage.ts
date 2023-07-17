/*
 * @Author: thunderchen
 * @Date: 2023-07-17 23:55:23
 * @LastEditTime: 2023-07-17 23:55:27
 * @email: 853524319@qq.com
 * @Description: multer 上传图片
 */

import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync(path.join(process.cwd(), 'my-uploads'));
    } catch (e) {}

    cb(null, path.join(process.cwd(), 'my-uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export { storage };
