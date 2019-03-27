const nodeGit = require('nodegit');
const config = require('../config');
const { beginDate, endDate } = require('./getDate');
// const singleTest = require('./singleTest');

console.log('From \x1b[34m%s\x1b[0m', beginDate);
console.log('To   \x1b[34m%s\x1b[0m\n', endDate);

// 获取修改的行数
function countAction(diffList) {
  return new Promise((resolve) => {
    let total = 0;
    diffList.forEach(async (diff, dx) => {
      const patches = await diff.patches();
      // console.log(2222);
      patches.forEach(async (patch, px) => {
        const hunks = await patch.hunks();
        // console.log(3333);
        hunks.forEach(async (hunk, hx) => {
          const lines = await hunk.lines();
          // console.log('diff', patch.oldFile().path(), patch.newFile().path());
          lines.forEach((line) => {
            const origin = line.origin();
            if (origin === 43 || origin === 45) {
              total += 1;
            }
          });
          // console.log(total);
          if (dx === diffList.length - 1 && px === patches.length - 1 && hx === hunks.length - 1) {
            resolve(total);
          }
        });
      });
    });
  });
}
// 计算工作量（行数）
async function countLines(x) {
  return new Promise(async (resolve) => {
    const diffList = await x.getDiff();
    const total = await countAction(diffList);
    resolve(total);
  });
}

module.exports = async () => {
  // singleTest();
  const promises = [];

  config.projects.forEach((p) => {
    promises.push(new Promise(async (resolve, reject) => {
      const projectName = p.name;
      const projectFolder = p.folder;
      const needCount = p.count;
      const temporaryFolder = `${config.dir + projectFolder}`;
      try {
        const repo = await nodeGit.Repository.open(`${temporaryFolder}/.git`);
        const walker = nodeGit.Revwalk.create(repo);
        walker.pushGlob('*');
        // 获取符合日期的commits
        const commits = await walker.getCommitsUntil((c) => {
          const now = c.date();
          return now > beginDate && now < endDate;
        });
        const selfCommits = [];
        Promise.all(commits.filter((x) => {
          const regexp = new RegExp(`${projectFolder}|update|merge`, 'gi');
          return !regexp.test(x.message());
        })
          .map(async (x) => {
            const total = needCount ? await countLines(x) : 0;
            selfCommits.push({
              msg: x.message().split(/\n|;/g).filter(v => v.length),
              total,
              project: projectName,
              committer: x.committer().name(),
            });
          })).then(() => {
          console.log('\x1b[33m%s\x1b[0m  \x1b[42;30m%s\x1b[0m  \x1b[34m%s\x1b[0m', 'Log', 'Success', projectFolder);
          resolve(selfCommits);
        });
      } catch (e) {
        console.log('\x1b[33m%s\x1b[0m  \x1b[41;30m%s\x1b[0m  \x1b[34m%s\x1b[0m', 'Log', 'Fail', projectFolder);
        reject(e);
      }
    }));
  });

  const result = await Promise.all(promises);
  return result;
};
