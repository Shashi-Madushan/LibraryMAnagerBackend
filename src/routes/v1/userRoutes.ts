import { Router } from 'express';
import { updateUserValidation, changePasswordValidation } from '@/middlewares/validations/userValidation';
import validationError from '@/middlewares/validationError';
import { getUserInfo, updateUserInfo, changePassword ,deleteAccount } from '@/controllers/v1/user';


const userRouter = Router();



userRouter.get('/me', getUserInfo);
userRouter.patch('/update', updateUserValidation, validationError, updateUserInfo);
userRouter.post('/change-password', changePasswordValidation, validationError ,changePassword);
userRouter.delete('/delete', deleteAccount);

export default userRouter;
