const date = new Date();
const beginDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 - date.getDay());
// 获取最近一周的首尾日期（周一 周日）
module.exports = {
  beginDate,
  endDate,
};
