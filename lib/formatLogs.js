const config = require('../config');

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

      const committerName = config.commiter[item.committer];

      if (!report[c].commits[item.committer]) {
        report[c].commits[item.committer] = { committer: committerName, msg: [] };
      }
      const commitItem = report[c].commits[item.committer];
      commitItem.msg = commitItem.msg.concat(item.msg);

      if (!load[committerName]) {
        load[committerName] = { total: 0 };
      }
      load[committerName].total += item.total;
    }
  }
  return {
    report,
    load,
  };
};
