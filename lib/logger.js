"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = __importDefault(require("bunyan"));
const logger = bunyan_1.default.createLogger({
    name: 'Object-Controller',
    level: 'trace',
    streams: [
        {
            stream: process.stdout
        }
    ]
});
exports.default = logger;
