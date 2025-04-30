import { Request, Response } from 'express';
import { uploadFile, getFileUrl, deleteFile } from '../services/s3.service';
import { getDb } from '../db';
import { v4 as uuidv4 } from 'uuid';


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
    const id = uuidv4();

    const db = getDb();
    await db.execute(
      'INSERT INTO files (id, s3_key, name, description) VALUES (?, ?, ?, ?)',
      [id, key, name, description]
    );
        res.status(201).json({ id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed' });
    }
};

export const get = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const db = getDb();
      const [rows] = await db.execute('SELECT * FROM files WHERE id = ?', [id]);
      const file = (rows as any[])[0];
  
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      const url = await getFileUrl(file.s3_key);
      res.json({ id: file.id, name: file.name, description: file.description, url });
    } catch (error) {
      console.error('Get error:', error);
      res.status(500).json({ message: 'Failed to retrieve file' });
    }
  };

  export const update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { name, description } = req.body;
  
      const db = getDb();
      const [rows] = await db.execute('SELECT * FROM files WHERE id = ?', [id]);
      const file = (rows as any[])[0];
  
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      await db.execute(
        'UPDATE files SET name = ?, description = ? WHERE id = ?',
        [name || file.name, description || file.description, id]
      );
  
      res.json({ id, name: name || file.name, description: description || file.description });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ message: 'Update failed' });
    }
  };
  
  export const remove = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const db = getDb();
      const [rows] = await db.execute('SELECT * FROM files WHERE id = ?', [id]);
      const file = (rows as any[])[0];
  
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      await deleteFile(file.s3_key);
      await db.execute('DELETE FROM files WHERE id = ?', [id]);
  
      res.status(204).send();
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ message: 'Delete failed' });
    }
  };
  
  export const list = async (req: Request, res: Response) => {
    try {
      const db = getDb();
      const [rows] = await db.execute('SELECT * FROM files');
      const files = await Promise.all(
        (rows as any[]).map(async (file) => ({
          id: file.id,
          name: file.name,
          description: file.description,
          url: await getFileUrl(file.s3_key),
        }))
      );
  
      res.json(files);
    } catch (error) {
      console.error('List error:', error);
      res.status(500).json({ message: 'Failed to fetch files' });
    }
  };