import { Router } from 'express';

import { updateUserValidation, changePasswordValidation } from '@/middlewares/validations/userValidation';
import validationError from '@/middlewares/validationError';

/**
 * controllers
 */
import { getUserInfo } from '@/controllers/v1/user/getUserInfo';
import { updateUserInfo } from '@/controllers/v1/user/updateUserInfo';
import { changePassword } from '@/controllers/v1/user/changePassword';
import { deleteAccount } from '@/controllers/v1/user/deleteAccount';
import { activateUser } from '@/controllers/v1/user/activateUser';
import { deactivateUser } from '@/controllers/v1/user/deactivateUser';
import { getAllUsers } from '@/controllers/v1/user/getAllUsers';

const userRouter = Router();

userRouter.get('/me', getUserInfo);
userRouter.patch('/update', updateUserValidation, validationError, updateUserInfo);
userRouter.post('/change-password', changePasswordValidation, validationError, changePassword);
userRouter.delete('/delete', deleteAccount);
userRouter.patch('/activate/:userId', activateUser);
userRouter.patch('/deactivate/:userId', deactivateUser);
userRouter.get('/all', getAllUsers);

export default userRouter;
