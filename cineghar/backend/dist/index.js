"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const configs_1 = require("./configs");
const mongodb_1 = require("./database/mongodb");
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
async function startServer() {
    await (0, mongodb_1.connectDb)();
    app_1.default.listen(configs_1.PORT, () => {
        console.log(`Server: http://localhost:${configs_1.PORT}`);
    });
}
startServer();
