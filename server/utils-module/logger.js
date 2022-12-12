import winston from "winston";
import morgan, { token } from "morgan";

const { combine, timestamp, json } = winston.format;

morgan.token("request-id", (req, res) => req.requestId);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.Console()],
});

const morganLogger = winston.createLogger({
  level: "http",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.Console()],
});

export const morganMiddleware = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      request_id: tokens["request-id"](req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, "content-length"),
      response_time: Number.parseFloat(tokens["response-time"](req, res)),
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        morganLogger.http(`incoming-request`, data);
      },
    },
  }
);

export const addRequestIdMiddleware = (req, res, next) => {
  // req.requestId = uuidv4();
  req.requestId = "uuidv4()";
  next();
};
