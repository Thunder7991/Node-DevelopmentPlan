const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const tojwt = promisify(jwt.sign);
const verify = promisify(jwt.verify);
const { uuid } = require("../config/config.default");

//required : 是否需要认证
module.exports.verifyToken = function (required = true) {
  return async (req, res, next) => {
    //获取头信息
    let token = req.headers.authorization;

    token = token ? token.split("Bearer ")[1] : null;
    if (token) {
      try {
        let userinfo = await verify(token, uuid);
        req.user = userinfo;
        next();
      } catch (error) {
        res.status("402").json({ error: "无效token!" });
      }
    } else if (required) {
      res.status(402).json({ error: "请传入token" });
    } else {
      next();
    }
  };
};

module.exports.createToken = async (userinfo) => {
  const token = await tojwt({ userinfo }, uuid, { expiresIn: 60 * 60 });
  return token;
};

// const token = jwt.sign(
//   {
//     foo: "hello",
//   },
//   "555"
// );

// console.log(token);

// const jwts = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJoZWxsbyIsImlhdCI6MTY3MjMyMzgyMH0.ic1GKXWLOVXAnA_1v5uSBSNaH3_-AypDtjuJD2GFHfY','555')
// console.log(jwts);
