const ENV = process.env.NODE_ENV || "development";

const devData = require("./development-data/index-dev");

const testData = require("./test-data/index-test");

const data = {
  development: devData,
  test: testData
};

module.exports = data[ENV];
