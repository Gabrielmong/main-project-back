//dependencies
const oracledb = require("oracledb");
const fs = require("fs");
const dbconfig = require("./dbconfig.js");

// container
const lib = {};
const libPath = "C:\\oracle\\instantclient_21_6";

if (libPath && fs.existsSync(libPath)) {
  oracledb.initOracleClient({ libDir: libPath });
}


module.exports = lib;
