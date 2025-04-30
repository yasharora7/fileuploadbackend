import { Router } from 'express';
import multer from 'multer';
import { upload, get, update, remove, list } from '../controllers/file.controller';
import { catchAsync } from '../utils/catchAsync';

const router = Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() });

router.post('/', uploadMiddleware.single('file'), catchAsync(upload));
router.get('/', catchAsync(list));
router.get('/:id', catchAsync(get));
router.put('/:id', catchAsync(update));
router.delete('/:id', catchAsync(remove));

export default router;
