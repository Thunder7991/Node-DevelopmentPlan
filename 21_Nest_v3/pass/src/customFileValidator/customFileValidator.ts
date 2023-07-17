/*
 * @Author: thunderchen
 * @Date: 2023-07-18 00:13:49
 * @LastEditTime: 2023-07-18 00:25:30
 * @email: 853524319@qq.com
 * @Description: 自定义fileValidator
 */

import { FileValidator } from '@nestjs/common';

export class MyFileValidator extends FileValidator {
  constructor(options) {
    super(options);
  }

  isValid(file: any): boolean | Promise<boolean> {
    if (file.size > 10000) {
      return false;
    }
    return true;
  }
  buildErrorMessage(file: Express.Multer.File): string {
    return `文件 ${file.originalname} 大小超出 10k`;
  }
}
