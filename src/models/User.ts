/**
 * Node medules
 */
import { Schema , model } from "mongoose";
import bcrypt from 'bcrypt';

/**
 * Custome modules 
 */


export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    firstName?: string;
    lastName?: string;
    isActive?: boolean;

}

/**
 *  * User schema
 */

const userSchema = new Schema<IUser>(
    {
        username:{
            type: String,
            required:[true, 'Username is required'],
            maxlength:[20, 'Username must be less than 20 characters'],
            unique:[true, 'Username must be unique'],
        },
        email:{
            type: String,
            required:[true, 'Email is required'],
            unique:[true, 'Email must be unique'],
            match:[/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        password:{
            type: String,
            required:[true, 'Password is required'],
            minlength:[6, 'Password must be at least 6 characters'],
        },
        role:{
            type: String,
            required: [true, 'Role is required'],
            enum:['user', 'admin'],
            default:'user',
        },
        firstName: {
            type: String,
            maxlength: [20, 'First name must be less than 20 characters'],
        },
        lastName: {
            type: String,
            maxlength: [20, 'Last name must be less than 20 characters'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },{
        timestamps: true,
    }
);

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        next();
        return;
    }

    // paassword hashing 
    this.password = await bcrypt.hash(this.password,10)
    next();
})

export const User = model<IUser>('User', userSchema);