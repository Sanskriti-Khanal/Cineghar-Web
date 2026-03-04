"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = void 0;
const zod_1 = __importDefault(require("zod"));
exports.PaginationDto = zod_1.default.object({
    page: zod_1.default.coerce.number().int().min(1).default(1),
    limit: zod_1.default.coerce.number().int().min(1).max(100).default(10),
});
