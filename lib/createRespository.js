const nodeGit = require('nodegit');
const config = require('../config');

// 创建本地仓库
module.exports = async (emptyProjects) => {
  const { username, password, reponame } = config;
  // 生成凭证（git 账号 密码）
  const credentials = nodeGit.Cred.userpassPlaintextNew(username, password);
  // 遍历生成本地仓库
  await Promise.all(
    emptyProjects.map(
      p => new Promise(async (resolve, reject) => {
        const projectName = p.folder;
        const projectPath = p.path;
        const temporaryFolder = config.dir + projectName;
        try {
          const repo = await nodeGit.Repository.init(temporaryFolder, 0);
          await nodeGit.Remote.create(repo, reponame, `${username}@${projectPath}`);
          const crepo = await nodeGit.Repository.open(`${temporaryFolder}/.git`);
          await crepo.fetchAll({ callbacks: { credentials() { return credentials; } } });
          console.log('\x1b[32m%s\x1b[0m  \x1b[42;30m%s\x1b[0m  \x1b[34m%s\x1b[0m', 'Create', 'Success', projectName);
          resolve();
        } catch (e) {
          console.log('\x1b[32m%s\x1b[0m  \x1b[41;30m%s\x1b[0m  \x1b[34m%s\x1b[0m', 'Create', 'Fail', projectName);
          reject(e);
        }
      }),
    ),
  );
};
