const date = new Date();
const beginDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 - date.getDay());

module.exports = {
  beginDate,
  endDate,
};
