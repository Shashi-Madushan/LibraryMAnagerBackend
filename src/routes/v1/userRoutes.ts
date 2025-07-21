import { Router } from 'express';

import { updateUserValidation, changePasswordValidation } from '@/middlewares/validations/userValidation';
import validationError from '@/middlewares/validationError';
import { authorizeRoles } from '@/middlewares/jwt/authorizeRoles';

/**
 * controllers
 */
import { getUserInfo } from '@/controllers/v1/user/getUserInfo';
import { updateUserInfo , updateUserById} from '@/controllers/v1/user/updateUserInfo';
import { changePassword } from '@/controllers/v1/user/changePassword';
import { deleteAccount ,deleteUserById } from '@/controllers/v1/user/deleteAccount';
import { activateUser } from '@/controllers/v1/user/activateUser';
import { deactivateUser } from '@/controllers/v1/user/deactivateUser';
import { getAllUsers } from '@/controllers/v1/user/getAllUsers';
import addUser from '@/controllers/v1/user/addUser';

const userRouter = Router();

userRouter.get('/me', getUserInfo);
userRouter.patch('/update', updateUserValidation, validationError, updateUserInfo);
userRouter.post('/change-password', changePasswordValidation, validationError, changePassword);
userRouter.delete('/delete', deleteAccount);

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Protected routes (admin only)
userRouter.use('/',asyncHandler(authorizeRoles('admin')) );
userRouter.post('/add', asyncHandler(addUser));
userRouter.patch('/:userId', updateUserValidation, validationError, updateUserById);
userRouter.patch('/activate/:userId', activateUser);
userRouter.patch('/deactivate/:userId', deactivateUser);
userRouter.get('/all', getAllUsers);
userRouter.delete('/:userId', deleteUserById);

export default userRouter;
