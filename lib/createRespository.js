const nodeGit = require('nodegit');
const config = require('../config');

module.exports = async (emptyProjects) => {
  const promises = [];
  const { username, password, reponame } = config;
  const credentials = nodeGit.Cred.userpassPlaintextNew(username, password);
  emptyProjects.forEach((p) => {
    promises.push(new Promise(async (resolve, reject) => {
      const projectName = p.folder;
      const projectPath = p.path;
      const temporaryFolder = config.dir + projectName;
      try {
        const repo = await nodeGit.Repository.init(temporaryFolder, 0);
        await nodeGit.Remote.create(repo, reponame, `${username}@${projectPath}`);
        const crepo = await nodeGit.Repository.open(`${temporaryFolder}/.git`);
        await crepo.fetchAll({
          callbacks: {
            credentials() {
              return credentials;
            },
          },
        });
        console.log('\x1b[32m%s\x1b[0m  \x1b[42;30m%s\x1b[0m  \x1b[34m%s\x1b[0m', 'Create', 'Success', projectName);
        resolve();
      } catch (e) {
        console.log('\x1b[32m%s\x1b[0m  \x1b[41;30m%s\x1b[0m  \x1b[34m%s\x1b[0m', 'Create', 'Fail', projectName);
        reject(e);
      }
    }));
  });
  await Promise.all(promises);
};
