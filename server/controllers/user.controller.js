import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { createUserService , signInService ,blackListToken , getAllUsersService} from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 

export const registerUser = asyncHandler(async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        const errorMessages = errors.array().map((error) => error.msg);
        throw new ApiError(400, "Validation failed", errorMessages);
    }

    // Destructure request body
    const { fullName , email, password } = req.body; 

    // Create the user using the service
    const newUser = await createUserService(fullName, email, password);

    // Generate token if the user model supports it
    const token = newUser.generateAuthToken
        ? newUser.generateAuthToken()
        : null; // Ensure generateAuthToken exists on the model

    // Send response
    return res
        .status(201)
        .json(
            new ApiResponse(201, { user: newUser, token }, "User registered successfully.")
        );
});

export const loginUser = asyncHandler(async ( req, res) => {
    const {email  ,password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 

    const loggedInUser = await signIn(email , password);     

    const token = loggedInUser.generateAuthToken();


    delete loggedInUser._doc.password;

    res.cookie('token', token);

    // const options = {
    //     httpOnly: true,
    //     secure: true
    // }
    
    return res
    .status(200)
    .cookie("token", token) 
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, token
            },
            "User logged In Successfully"
        )
    ) 
})

export const getUserProfile = asyncHandler(async(req, res) => {

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        allUsers,
        "User fetched successfully"
    ))
})

export const logoutUser = asyncHandler(async(req, res) => {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer " ,"");

    await blackListToken(token);
    
    res.clearCookie('token');

    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        "User Logged Out successfully"
    ))
});

export const getAllUsers = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(401, "Unauthorized: User ID not found.");
    }
    const allUsers = await getAllUsersService(userId);     

    return res
    .status(200)
    .json(new ApiResponse(
        200, allUsers,
        "All Users fetched successfully"
    ))
})