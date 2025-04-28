"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.get = exports.upload = void 0;
const s3_service_1 = require("../services/s3.service");
const fileStore = {};
const upload = async (req, res) => {
    try {
        const file = req.file;
        const { name, description } = req.body;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const key = await (0, s3_service_1.uploadFile)(file);
        const id = key;
        fileStore[id] = { id, key, name, description };
        res.status(201).json({ id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed' });
    }
};
exports.upload = upload;
const get = async (req, res) => {
    const id = req.params.id;
    const fileMeta = fileStore[id];
    if (!fileMeta) {
        return res.status(404).json({ message: 'File not found' });
    }
    const url = (0, s3_service_1.getFileUrl)(fileMeta.key);
    res.json({ ...fileMeta, url });
};
exports.get = get;
const update = async (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;
    const fileMeta = fileStore[id];
    if (!fileMeta) {
        return res.status(404).json({ message: 'File not found' });
    }
    if (name)
        fileMeta.name = name;
    if (description)
        fileMeta.description = description;
    res.json(fileMeta);
};
exports.update = update;
const remove = async (req, res) => {
    const id = req.params.id;
    const fileMeta = fileStore[id];
    if (!fileMeta) {
        return res.status(404).json({ message: 'File not found' });
    }
    await (0, s3_service_1.deleteFile)(fileMeta.key);
    delete fileStore[id];
    res.status(204).send();
};
exports.remove = remove;
