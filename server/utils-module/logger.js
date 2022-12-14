import winston from "winston";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";

const { combine, timestamp, json, errors } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(errors({ stack: true }), timestamp(), json()),
  exitOnError: false,
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
});

const morganLogger = winston.createLogger({
  level: "http",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.Console()],
});

// add custom token to return the request id
morgan.token("request-id", (req, res) => req.requestId);

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

// add request id and logger function to the request
export const addRequestIdMiddleware = (req, res, next) => {
  req.requestId = uuidv4();
  req.logger = logger.child({ request_id: req.requestId });
  next();
};
