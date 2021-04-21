const winston = require('winston');
const path = require('path');

const DEVELOP = "false";

const myformat = winston.format.combine(
    winston.format.json(),
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${new Date().toDateString()} ${new Date().toTimeString()} ${info.level}: ${info.message}`)
);

const logger = winston.createLogger({
  level: 'info',
  format: myformat,
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: path.join(__dirname, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(__dirname, 'combined.log') }),
  ],
});

logger.add(new winston.transports.Console({
  format: myformat,
}));

//logger.info('API MetalKnight Lancée');
//logger.error("Test message d'erreur");

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
module.exports = {
  info: function (msg) { 
    if(process.env.DEVELOP === DEVELOP)
      logger.info(msg);
  },
  error: function (msg) { 
    if(process.env.DEVELOP === DEVELOP)
      logger.error(msg);
  },
}