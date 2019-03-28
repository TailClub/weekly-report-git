/**
 * 格式化信息 各项目各成员的提交信息
 * 项目名
 *    项目成员
 *      成员工作列表
 *    项目成员
 *      成员工作列表
 * 同上
 */
module.exports = (logs) => {
  const load = {};
  const report = [];

  for (let c = 0; c < logs.length; c += 1) {
    const commits = logs[c];
    for (let i = 0; i < commits.length; i += 1) {
      const item = commits[i];
      if (!report[c]) {
        report[c] = { project: item.project, commits: {} };
      }

      if (!report[c].commits[item.committer]) {
        report[c].commits[item.committer] = { committer: item.committer, msg: [] };
      }
      const commitItem = report[c].commits[item.committer];
      commitItem.msg = commitItem.msg.concat(item.msg);

      if (!load[item.committer]) {
        load[item.committer] = { total: 0 };
      }
      load[item.committer].total += item.total;
    }
  }
  return {
    report,
    load,
  };
};
