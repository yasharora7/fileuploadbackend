"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const file_controller_1 = require("../controllers/file.controller");
const catchAsync_1 = require("../utils/catchAsync");
const router = (0, express_1.Router)();
const uploadMiddleware = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/', uploadMiddleware.single('file'), (0, catchAsync_1.catchAsync)(file_controller_1.upload));
router.get('/:id', (0, catchAsync_1.catchAsync)(file_controller_1.get));
router.put('/:id', (0, catchAsync_1.catchAsync)(file_controller_1.update));
router.delete('/:id', (0, catchAsync_1.catchAsync)(file_controller_1.remove));
exports.default = router;
