// server/index.js
const express = require("express");
const StringDecoder = require("string_decoder").StringDecoder;
const handlers = require("./server/libs/handlers.js");
const HTTP = require("http");
const URL = require("url");
const helpers = require("./server/libs/helpers.js");
const config = require("./server/libs/config.js");

// Initialize the http server
const httpServer = HTTP.createServer(function (req, res) {
  unifiedServer(req, res);
},);

// Start the http server
httpServer.listen(config.httpPort, () => {
  console.log(`    Server is listening on port ${config.httpPort}. \n    Press CTRL + C to stop the server. \n    Check connection at: http://localhost:${config.httpPort}/ping \n\n`);
});

const unifiedServer = (req, res) => {
  // Parse the url
  var parsedUrl = URL.parse(req.url, true);

  // Get the pathname
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the request method
  var method = req.method.toLowerCase();

  // Get the headers as an object
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();

    // choose the handler
    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object
      payload = typeof payload == "object" ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "Content-Type",
        "Authorization"
      );

      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log("Returning this response: ", statusCode, payloadString);
    });
  });
};

const router = {
  ping: handlers.ping,
  crud: handlers.crud,
  userCrud: handlers.userCrud,
  crudReviews: handlers.crudReviews,
  loneReview: handlers.loneReview,
};
