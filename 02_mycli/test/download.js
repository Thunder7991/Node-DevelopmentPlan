const download = require('download-git-repo');

download(
  'direct:https://github.com/vuejs/vue.git',
  './xxx', //放置的位置
  {
    clone: true,
  },
  (err) => {
    console.log(err);
  },
);
