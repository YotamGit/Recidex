import winston from "winston";
import morgan from "morgan";

const { combine, timestamp, json } = winston.format;

const morganLogger = winston.createLogger({
  level: "http",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.Console()],
});

export const morganMiddleware = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
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
