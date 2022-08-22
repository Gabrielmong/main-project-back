// helpers file

// dependencies

const fs = require("fs");

// container
const helpers = {};


helpers.parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

helpers.deleteFile = function (filePath) {
  try {
    fs.unlinkSync(filePath);
    console.log("File deleted");
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
}

// export the module
module.exports = helpers;
