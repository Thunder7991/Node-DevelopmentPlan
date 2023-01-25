const crypto = require('crypto');

exports.md5 = str => {

  return crypto.createHash('md5').update(str).digest('hex');

};
