/*
 * @Author: thunderchen
 * @Date: 2023-05-28 13:15:50
 * @LastEditTime: 2023-05-28 13:26:29
 * @email: 853524319@qq.com
 * @Description: swagger
 */

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as packageConfig from '../package.json';
export const generateDocument = (app) => {
  const options = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setDescription(packageConfig.description)
    .setVersion(packageConfig.version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/doc', app, document);
};
