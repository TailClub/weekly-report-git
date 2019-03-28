const nodeGit = require('nodegit');
const config = require('../config');
const { beginDate, endDate } = require('./getDate');

// 用于commit信息去重
const commitSet = new Set();

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

// 获取commit信息
async function getCommits(repo, ref, project) {
  return new Promise(async (resolve, reject) => {
    const walker = nodeGit.Revwalk.create(repo);
    walker.pushRef(ref);
    // 获取符合日期的commits
    const commits = await walker.getCommitsUntil((c) => {
      const now = c.date();
      return now > beginDate && now < endDate;
    });
    // getCommitsUntil 最后一个数据不符合日期条件
    commits.pop();
    // 个人提交记录集合
    const selfCommits = [];
    Promise.all(commits.filter((x) => {
      // 过滤不需要统计的commit
      const regexp = new RegExp(`${project.folder}|update|merge`, 'gi');
      return !regexp.test(x.message());
    })
      .map(async (x) => {
        const total = project.count ? await countLines(x) : 0;
        // 通过sha判断是否重复 merge分支的时候可能有重复的commit
        const sha = x.sha();
        if (!commitSet.has(sha)) {
          commitSet.add(sha);
          selfCommits.push({
            total,
            project: project.name,
            msg: x.message().split(/\n|;/g).filter(v => v.length),
            committer: config.commiter[x.committer().name()],
          });
        }
      })).then(() => {
      resolve(selfCommits);
    }).catch((e) => {
      reject(e);
    });
  });
}

module.exports = async () => {
  const promises = [];
  // 遍历所有项目
  config.projects.forEach((p) => {
    promises.push(new Promise(async (resolve, reject) => {
      try {
        // 获取各个项目所有分支的提交记录
        const walkerActions = [];
        const repo = await nodeGit.Repository.open(`${config.dir + p.folder}/.git`);
        const refs = (await repo.getReferenceNames(nodeGit.Reference.TYPE.LISTALL)).filter(v => v.indexOf(config.reponame) > -1);

        refs.forEach((v) => { walkerActions.push(getCommits(repo, v, p)); });

        Promise.all(walkerActions).then((res) => {
          // 整合记录数据
          let result = [];
          res.forEach((v) => { result = result.concat(v); });
          console.log('\x1b[33m%s\x1b[0m  \x1b[42;30m%s\x1b[0m  \x1b[34m%s\x1b[0m', 'Log', 'Success', p.folder);
          resolve(result);
        }).catch((e) => {
          throw new Error(e);
        });
      } catch (e) {
        console.log('\x1b[33m%s\x1b[0m  \x1b[41;30m%s\x1b[0m  \x1b[34m%s\x1b[0m', 'Log', 'Fail', p.folder);
        reject(e);
      }
    }));
  });

  const result = await Promise.all(promises);
  return result;
};
