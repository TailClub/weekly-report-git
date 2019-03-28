
// const fs = require('fs');
const vis = require('markvis');
const d3node = require('d3-node');
const md = require('markdown-it')();
const webshot = require('node-webshot');
const config = require('../config');
const formatLogs = require('./formatLogs');
const formatHtmlStr = require('./formatHtmlStr');
const formatMarkdown = require('./formatMarkdown');


module.exports = (logs) => {
  const now = new Date();
  const logsData = formatLogs(logs.filter(v => v.length));
  const mdText = formatMarkdown(logsData);
  const htmlStr = formatHtmlStr(md.use(vis).render(mdText, { d3node }));

  // 生成html文件
  // fs.writeFile(`${config.reportDir}/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.html`, htmlStr, (err) => {
  //   if (err) throw err;
  //   console.log('\n\x1b[35m%s\x1b[0m', 'Finish');
  // });

  // 生成jpg图片
  webshot(htmlStr, `${config.reportDir}/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.jpg`, { siteType: 'html', streamType: 'jpg', shotSize: { width: 'window', height: 'all' } }, (err) => {
    if (err) {
      console.log('\n\x1b[41;30m%s\x1b[0m %s', 'Error', err);
    } else {
      console.log('\n\x1b[35m%s\x1b[0m', 'Finish');
    }
  });
};
