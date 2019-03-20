#! /usr/bin/env node

const fs = require('fs');
const config = require('../config');
const getRepositoryLog = require('../lib/getRepositoryLog');
const createRespository = require('../lib/createRespository');
const renderReport = require('../lib/renderReport');


async function init() {
  const folders = fs.readdirSync(config.dir);
  //   获取到不存在的git仓库（约定文件夹都是git仓库）（其实也可以根据是否有.git 或者 nodeGit的exist）
  const emptyProjects = config.projects.filter(v => folders.indexOf(v.folder) === -1);
  if (emptyProjects.length) {
    await createRespository(emptyProjects);
  }
  const logs = await getRepositoryLog();
  renderReport(logs);
}

init();
