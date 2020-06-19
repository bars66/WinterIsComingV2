"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var logger_1 = require("./logger");
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return logger_1.default; } });
var getEnv_1 = require("./utils/getEnv");
Object.defineProperty(exports, "getEnv", { enumerable: true, get: function () { return getEnv_1.getEnv; } });
