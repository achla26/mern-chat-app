import { Router } from "express";
import { body } from "express-validator";
import { registerUser , verifyOTP,loginUser , getUserProfile , logoutUser , getAllUsers} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";


const router = Router();

router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter Valid Email'), 
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    registerUser
);


router.post("/otp-verification",[
    body('otp').notEmpty().withMessage('OTP is required'),
    body('email').isEmail().withMessage('Enter Valid Email'),  
] ,verifyOTP);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    loginUser
);

router.get('/profile', authUser, getUserProfile)
router.get('/logout', authUser,logoutUser)

router.get('/all', authUser, getAllUsers);

export default router