/**
 *  Node modules
 */
import { Router } from "express";
// import cookieParser from "cookie-parser"; // Uncomment if you want to use cookie-parser middleware
import { cookie } from "express-validator";

/**
 * Controllers
 */
import register from "@/controllers/v1/auth/register";
import login from "@/controllers/v1/auth/login";
import refreshToken from "@/controllers/v1/auth/refreshToken";
import logout from "@/controllers/v1/auth/logout";

/**
 *  Middlewares
 */
import validationError from "@/errors/validationError";
import { registerValidation, loginValidation, refreshTokenValidation } from "@/middlewares/validations/authValidation";

const authRouter = Router();

authRouter.post('/register',
    registerValidation,
    validationError,
    register
);

authRouter.post('/login',
    loginValidation,
    validationError,
    login
);
authRouter.post('/refresh-token'
    , refreshTokenValidation
    
    , validationError
    , refreshToken);

authRouter.post('/logout',
    refreshTokenValidation,
    validationError,
    logout
);

export default authRouter;