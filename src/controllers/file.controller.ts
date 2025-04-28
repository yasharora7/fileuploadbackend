import { Request, Response } from 'express';
import { uploadFile, getFileUrl, deleteFile } from '../services/s3.service';

interface FileMeta {
    id: string;
    key: string;
    name: string;
    description?: string;
}

const fileStore: Record<string, FileMeta> = {};

export const upload = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const { name, description } = req.body;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const key = await uploadFile(file);
        const id = key;

        fileStore[id] = { id, key, name, description };

        res.status(201).json({ id:key });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed' });
    }
};

export const get = async(req: Request, res: Response) => {
    const id = req.params.id;
    const fileMeta = fileStore[id];

    if (!fileMeta) {
        return res.status(404).json({ message: 'File not found' });
    }

    const url = getFileUrl(fileMeta.key);

    res.json({ ...fileMeta, url });
};

export const update = async(req: Request, res: Response) => {
    const id = req.params.id;
    const { name, description } = req.body;

    const fileMeta = fileStore[id];

    if (!fileMeta) {
        return res.status(404).json({ message: 'File not found' });
    }

    if (name) fileMeta.name = name;
    if (description) fileMeta.description = description;

    res.json(fileMeta);
};

export const remove = async (req: Request, res: Response) => {
    const id = req.params.id;
    const fileMeta = fileStore[id];

    if (!fileMeta) {
        return res.status(404).json({ message: 'File not found' });
    }

    await deleteFile(fileMeta.key);
    delete fileStore[id];

    res.status(204).send();
};
