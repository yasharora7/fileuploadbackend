"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFileUrl = exports.uploadFile = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const uploadFile = async (file) => {
    const key = `${(0, uuid_1.v4)()}-${file.originalname}`;
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    await s3.upload(params).promise();
    return key;
};
exports.uploadFile = uploadFile;
const getFileUrl = (key) => {
    return s3.getSignedUrl('getObject', {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: 60 * 60, // 1 hour expiry
    });
};
exports.getFileUrl = getFileUrl;
const deleteFile = async (key) => {
    await s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: key,
    }).promise();
};
exports.deleteFile = deleteFile;
