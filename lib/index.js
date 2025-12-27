"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogStorage = exports.installNetworkLogger = exports.installConsoleLogger = void 0;
var consoleLogger_1 = require("./logger/consoleLogger");
Object.defineProperty(exports, "installConsoleLogger", { enumerable: true, get: function () { return consoleLogger_1.installConsoleLogger; } });
var networkLogger_1 = require("./logger/networkLogger");
Object.defineProperty(exports, "installNetworkLogger", { enumerable: true, get: function () { return networkLogger_1.installNetworkLogger; } });
var logStorage_1 = require("./storage/logStorage");
Object.defineProperty(exports, "LogStorage", { enumerable: true, get: function () { return logStorage_1.LogStorage; } });
