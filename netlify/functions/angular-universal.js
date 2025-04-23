const path = require("path");
const fs = require("fs");
const { app } = require(path.join(__dirname, "../dist/afnan-hutang-system-angular-frontend/server/main.js"));

exports.handler = async (event, context) => {
  const req = {
    method: event.httpMethod,
    url: event.path,
    headers: event.headers,
    body: event.body,
    queryStringParameters: event.queryStringParameters,
  };

  const res = {
    setHeader: (name, value) => {
      context.callbackWaitsForEmptyEventLoop = false;
      context.succeed({
        statusCode: 200,
        body: value,
        headers: {
          "Content-Type": "text/html",
        },
      });
    },
    status: (code) => {
      res.statusCode = code;
      return res;
    },
    send: (body) => {
      context.succeed({
        statusCode: res.statusCode || 200,
        body: body,
        headers: {
          "Content-Type": "text/html",
        },
      });
    },
  };

  return new Promise((resolve) => {
    app(req, res);
  });
};
