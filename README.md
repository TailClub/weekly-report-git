# weekly-report

This is an automated reporting tool for my job

# install

```js
npm install -g @foxtail/weekly-report-git
```

# usage

```js
foxrpt
```

# preview

![](https://ws4.sinaimg.cn/large/006tKfTcgy1g1gnmhjnczj30sg1mh0uf.jpg)

# config

Please edit the config file and provide your repositories directory and so on

```js
// ./config/index.js
module.exports = {
    username: 'username', // Git username
    password: 'password', // Git password
    reponame: 'origin', // Repository name
    dir: 'Git directory path', // /Users/viccici/github
    reportDir: 'Report directory path', // /Users/viccici/report
    commiter: {
        'Git name': 'Real name' // Git committer name matching the real name
    },
    projects: [
        {
            name: 'Project name', // We often use chinese project name
            folder: 'Project folder', // Git folder name that based on git path.  [ PS: weekly-report-git ]
            path: 'Git path',
            count: true // Whether to count
        }
    ]
}
```

# change log

## v1.2.2 - v1.2.3
1. Update readme

## v1.2.1
1. Fix statistical errors
2. Fix deduplicaiton errors

## v1.2.0
1. Getting commits from all branches without clone the project.
2. Support commits data deduplication.
