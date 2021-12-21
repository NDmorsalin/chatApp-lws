// eslint-disable-next-line no-useless-escape
const escape = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

module.exports = escape;
