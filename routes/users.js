"use strict"
const express = require("express");
const router = express.Router();
const {asyncHandler} = require("../middleware/asyncHandler");
const {authenticateUser} = require("../middleware/basic_auth");
const {User} = require("../models");


//User get routes with basic-authentication middleware and asyncHandler middleware
router.get("/users",authenticateUser,asyncHandler( async(req,res,next)=>{
    try{
        const authUser = req.currentUser; //current user
        res.status(200)
        .json({message:"Authorized Successful!",
                id: authUser.id,
                firstName: authUser.firstName,
                lastName: authUser.lastName,
                emailAddress: authUser.emailAddress});
    }catch(err){
        next(err);
    }
}));


// User get routes with asyncHandler middleware
router.post("/users",asyncHandler(async (req,res,next)=>{
    try{
        const newUser = await User.create(req.body); //new user data
        res.status(201).end().redirect("/")
    }catch(err){
        //http status to 400 when deal with SequelizeValidationError
        if(err.name === "SequelizeValidationError"){
            err.status = 400;
        }
        next(err);
    }
}));



module.exports = router








