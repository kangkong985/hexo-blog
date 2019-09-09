'use strict'

hexo.extend.filter.register('before_post_render', function (data) {
  
  var config = this.config;
  // console.log("!" + config.footnote);
  // console.log(this.config);
  // console.log(Object.keys(data));
  if (data.footnote !== true)
    {
      return data;
    }
  // console.log(data.content)
  data.content = data.content.replace(/【~([^】]+)】/g, '<span class="foot-note-span">【$1】</span>')
  return data;
})