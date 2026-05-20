const { AsyncLocalStorage } = require('node:async_hooks');
const rootLogger = require('@/config/logger');

const loggerContext = new AsyncLocalStorage();

function getStore() {
  return loggerContext.getStore();
}

function getLogger() {
  const store = getStore();
  const traceId = store?.traceId;
  return traceId ? rootLogger.child({ traceId }) : rootLogger;
}

const logger = {
  info(obj, msg) {
    if (typeof obj === 'string') { msg = obj; obj = undefined; }
    return getLogger().info(obj, msg);
  },
  warn(obj, msg) {
    if (typeof obj === 'string') { msg = obj; obj = undefined; }
    return getLogger().warn(obj, msg);
  },
  error(obj, msg) {
    if (typeof obj === 'string') { msg = obj; obj = undefined; }
    return getLogger().error(obj, msg);
  },
  debug(obj, msg) {
    if (typeof obj === 'string') { msg = obj; obj = undefined; }
    return getLogger().debug(obj, msg);
  },
  child(bindings) {
    return getLogger().child(bindings);
  },
  flush() {
    return rootLogger.flush();
  },
};

module.exports = logger;
module.exports.loggerContext = loggerContext;
module.exports.getLogger = getLogger;
