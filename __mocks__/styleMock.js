// Mock for CSS modules to return the className as is
module.exports = new Proxy(
  {},
  {
    get: function (target, className) {
      return className;
    },
  }
);
