"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
exports.initDevInspector = initDevInspector;
const consoleLogger_1 = require("./logger/consoleLogger");
const networkLogger_1 = require("./logger/networkLogger");
const logStorage_1 = require("./storage/logStorage");
const panel_1 = require("./ui/panel");
function initDevInspector(options = {}) {
    var _a, _b, _c, _d, _e, _f;
    const storage = (_a = options.storage) !== null && _a !== void 0 ? _a : new logStorage_1.LogStorage({
        maxSize: options.maxSize,
    });
    const consoleEnabled = (_b = options.console) !== null && _b !== void 0 ? _b : true;
    const networkEnabled = (_c = options.network) !== null && _c !== void 0 ? _c : true;
    const panelEnabled = (_d = options.panel) !== null && _d !== void 0 ? _d : true;
    const consoleLogger = consoleEnabled
        ? (0, consoleLogger_1.installConsoleLogger)({
            emit: (e) => storage.add(e),
            levels: options.consoleLevels,
        })
        : undefined;
    const networkLogger = networkEnabled
        ? (0, networkLogger_1.installNetworkLogger)(Object.assign({ emit: (e) => storage.add(e) }, ((_e = options.networkOptions) !== null && _e !== void 0 ? _e : {})))
        : undefined;
    const panel = panelEnabled
        ? (0, panel_1.createPanel)(Object.assign({ storage }, ((_f = options.panelOptions) !== null && _f !== void 0 ? _f : {})))
        : undefined;
    const destroy = () => {
        try {
            panel === null || panel === void 0 ? void 0 : panel.destroy();
        }
        catch (_a) {
            void 0;
        }
        try {
            consoleLogger === null || consoleLogger === void 0 ? void 0 : consoleLogger.uninstall();
        }
        catch (_b) {
            void 0;
        }
        try {
            networkLogger === null || networkLogger === void 0 ? void 0 : networkLogger.uninstall();
        }
        catch (_c) {
            void 0;
        }
    };
    return { storage, panel, consoleLogger, networkLogger, destroy };
}
exports.init = initDevInspector;
