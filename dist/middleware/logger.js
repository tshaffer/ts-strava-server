"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (request, response, next) => {
    console.log(`${request.method} ${request.protocol}://${request.get('host')}${request.originalUrl}`);
    next();
};
exports.default = logger;
//# sourceMappingURL=logger.js.map