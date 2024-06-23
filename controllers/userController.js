import asyncHandler from "../middlwares/asyncHandler.js";
import User from "../models/userModel.js"
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";


const createUser = asyncHandler(async (req, res) => {
    
    const {firstname, lastname, email, phonenumber, passwords} = req.body;
    if (!firstname || !lastname || !email || !phonenumber || !passwords) {
        throw new Error("please fill the all fields");
    }

    const userExist = await User.findOne({email});
    if (userExist) res.status(400).send("User already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwords, salt);
    const newUser = new User({firstname, lastname, email, phonenumber, passwords:hashedPassword});

    try {
        await newUser.save();
        createToken(res,newUser._id);

        res
        .status(200)
        .json({
            _id: newUser._id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
            phonenumber: newUser.phonenumber,
            isAdmin: newUser.isAdmin
        });
        
    } catch (error) {
        res.status(400);
        throw new Error("Invalid user data");
        
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser){
        const isPasswordValid = await bcrypt.compare(password, 
            existingUser.passwords
        );
        
        if(isPasswordValid){
            createToken(res, existingUser._id);
            res
            .status(200)
            .json({
                _id: existingUser._id,
                firstname: existingUser.firstname,
                lastname: existingUser.lastname,
                email: existingUser.email,
                phonenumber: existingUser.phonenumber,
                isAdmin: existingUser.isAdmin
            });
            return;
    
        } else{
            res.status(400).json({message : "Password Invalid"});
        }
    }else{
        res.status(400).json({message : "Email is Invalid"});
    }

});

const logoutCurrentUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '',{
        httpOnly : true,
        expires: new Date(0)
    });
    res.status(200).json({message : "User logged out"});

});

const getAllUsers = asyncHandler(async (req, res) => {
     const users = await User.find({});
     res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        res. json({
            id : user._id,
            firstname : user.firstname,
            lastname : user.lastname,
            email : user.email,
            phonenumber : user.phonenumber
        });
    }else{
        res.status(404)
        throw new Error("User not found");
    }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.firstname = req.body.firstname || user.firstname;
        user.lastname = req.body.lastname || user.lastname
        user.email = req.body.email || user.email;
        user.phonenumber = req.body.phonenumber || user.phonenumber

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.passwords = hashedPassword;
        }
        const updatedUser = await user.save();
        

        res.json({
            _id : updatedUser._id,
            firstname : updatedUser.firstname,
            lastname : updatedUser.lastname,
            email : updatedUser.email,
            phonenumber : updatedUser.phonenumber,
            isAdmin : updatedUser.isAdmin
        });

    }else{
        res.status(404);
        throw new Error ("User not found");
    }
});

const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error("Cannot delete Admin User.");
        }
        await User.deleteOne({_id: user._id});
        res.status(200).json({message : "User removed successfully."});


    }else{
        res.status(404);
        throw new Error("User not found");
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user){
        res.status(200).json(user);

    }else{
        res.status(404).json({ error: "User not found" });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        user.firstname = req.body.firstname || user.firstname;
        user.lastname = req.body.lastname || user.lastname;
        user.email = req.body.email || user.email;
        user.phonenumber = req.body.phonenumber || user.phonenumber
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save()
        res.json({
            _id : updatedUser.id,
            firstname : updatedUser.firstname,
            lastname : updatedUser.lastname,
            email : updatedUser.email,
            phonenumber : updatedUser.phonenumber,
            isAdmin : updatedUser.isAdmin
        })

    }else{
        res.status(404).json({message : "User not found"});
    }

});



export { 
    createUser, 
    loginUser, 
    logoutCurrentUser, 
    getAllUsers, 
    getCurrentUserProfile, 
    updateCurrentUserProfile, 
    deleteUserById, 
    getUserById,
    updateUser
};