import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
    },
    password: {
        type: String,
        required: true,
        select: false,
    }, 
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.AUTH_TOKEN_EXPIRY });
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.pre("save" , async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password , 10)
    next()
})

// userSchema.statics.hashedPassword = async function (password) {
//     return await bcrypt.hash(password, 10);
// }

export const User = mongoose.model("user" , userSchema)