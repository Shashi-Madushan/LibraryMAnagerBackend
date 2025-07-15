import { Router } from 'express';
import { addBook } from '@/controllers/v1/books/addBook';
import { getAllBooks } from '@/controllers/v1/books/getAllBooks';
import { getBookById } from '@/controllers/v1/books/getBookById';
import { getBooksByCategory } from '@/controllers/v1/books/getBooksByCategory';
import { updateBook } from '@/controllers/v1/books/updateBook';
import { deleteBook } from '@/controllers/v1/books/deleteBook';
import { authorizeRoles } from '@/middlewares/jwt/authorizeRoles';

const bookRouter = Router();

// Public routes
bookRouter.get('/', getAllBooks);
bookRouter.get('/category/:category', getBooksByCategory);
bookRouter.get('/:id', getBookById);

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Protected routes (admin only)
bookRouter.use('/',asyncHandler(authorizeRoles('admin')) );
bookRouter.post('/', addBook);
bookRouter.put('/:id', updateBook);
bookRouter.delete('/:id', deleteBook);

export default bookRouter;
