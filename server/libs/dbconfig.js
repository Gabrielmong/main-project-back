const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    user          : process.env.NODE_ORACLEDB_USER || "VSCODE",
    password      : process.env.NODE_ORACLEDB_PASSWORD || "ORACLE",
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || process.env.CONN_STRING,
};