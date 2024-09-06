"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function loadConfig() {
    const configPath = path_1.default.join(process.cwd(), 'linguee-config.json');
    if (!fs_1.default.existsSync(configPath)) {
        throw new Error('linguee-config.json is missing.');
    }
    const config = JSON.parse(fs_1.default.readFileSync(configPath, 'utf-8'));
    return config;
}
