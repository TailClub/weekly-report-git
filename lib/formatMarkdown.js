module.exports = (logsData = { report: [], load: {} }) => {
  const mdText = [];
  const { report, load } = logsData;
  for (let p = 0, pl = report.length; p < pl; p += 1) {
    const logsItem = report[p];
    mdText.push(`## ${logsItem.project}`);
    const { commits } = logsItem;
    Object.keys(commits).forEach((key) => {
      const commitItem = commits[key];
      mdText.push(`> ${commitItem.committer}`);
      commitItem.msg.forEach((msgItem, index) => {
        mdText.push(`${index + 1}. ${msgItem.replace(/\*/g, '')}`);
      });
    });
  }
  mdText.push('## 本周项目代码量（行数）(不计其他工作)');
  mdText.push('```vis');
  mdText.push('  layout: bar');
  mdText.push('  data: [');
  const pieCode = [];
  Object.keys(load).forEach((key) => {
    pieCode.push(`  { key : "${key}:${load[key].total}" , value : ${load[key].total} }`);
  });
  mdText.push(pieCode.join(',\n'));
  mdText.push(']');
  mdText.push('```');

  return mdText.join('\n');
};
