"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
function getEnv(envName) {
    const env = process.env[envName];
    if (!env)
        throw new Error(`process.env.${envName} must be exists`);
    return env;
}
exports.getEnv = getEnv;
