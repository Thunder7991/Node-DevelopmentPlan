const Joi = require('joi');
module.exports.videoValidator = async (ctx, next) => {
  const schema = Joi.object({
    title: Joi.string()
      .max(20)
      .rule({ message: '视频名长度不能大于20' })
      .required()
      .error(new Error('视频名不能为空!')),
      vodvideoId:Joi.string().required()
  }).validate(ctx.request.body,{allowUnknown:true});
 
  if (schema.error) {
    //抛出错误
    ctx.throw(400, schema.error);
  }
  await next();
};

