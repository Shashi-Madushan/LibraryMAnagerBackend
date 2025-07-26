import { Router } from 'express';
import { upload } from '@/middlewares/fileUpload';
import { addBook } from '@/controllers/v1/books/addBook';
import { getAllBooks } from '@/controllers/v1/books/getAllBooks';
import { getBookById } from '@/controllers/v1/books/getBookById';
import { getBooksByCategory } from '@/controllers/v1/books/getBooksByCategory';
import { updateBook } from '@/controllers/v1/books/updateBook';
import { deleteBook } from '@/controllers/v1/books/deleteBook';
import { authorizeRoles } from '@/middlewares/jwt/authorizeRoles';
import { getBooksByName } from '@/controllers/v1/books/getBookByName';

const bookRouter = Router();

// Public routes
bookRouter.get('/', getAllBooks);
bookRouter.get('/category/:category', getBooksByCategory);
bookRouter.get('/:id', getBookById);
bookRouter.get('/name/:name', getBooksByName);

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Protected routes (admin only)
bookRouter.use(asyncHandler(authorizeRoles('admin')));

// Admin routes with file upload
bookRouter.post('/', upload.single('image'), asyncHandler(addBook));
bookRouter.put('/:id', upload.single('image'), asyncHandler(updateBook));
bookRouter.delete('/:id', asyncHandler(deleteBook));

export default bookRouter;
