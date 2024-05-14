import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },

        lastname: {
            type: String,
            required: true
        },

        email :{
            type: String,
            required: true,
            unique: true
        },

        phonenumber :{
            type: String,
            required: true,
            unique: true
        },

        passwords: {
            type: String,
            required: true
        },

        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    
    { timestamps: true}
);

const User = mongoose.model('User', userSchema);
export default User;