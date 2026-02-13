"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploads = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const http_error_1 = require("../errors/http-error");
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        const uploadPath = path_1.default.join(__dirname, "../../uploads/");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, path_1.default.join(__dirname, "../../uploads/"));
    },
    filename: function (_req, file, cb) {
        const fileSuffix = (0, uuid_1.v4)();
        cb(null, fileSuffix + "-" + file.originalname);
    },
});
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new http_error_1.HttpError(400, "Invalid file type, only images are allowed!"));
    }
};
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter,
});
exports.uploads = {
    single: (fieldName) => upload.single(fieldName),
    array: (fieldName, maxCount) => upload.array(fieldName, maxCount),
    fields: (fieldsArray) => upload.fields(fieldsArray),
};
