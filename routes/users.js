"use strict"
const express = require("express");
const router = express.Router();
const {asyncHandler} = require("../middleware/asyncHandler");
const {authenticateUser} = require("../middleware/basic_auth");
const {User} = require("../models");



router.get("/users",authenticateUser,asyncHandler( async(req,res,next)=>{
    try{
        const authUser = req.currentUser;
        res.status(200)
        .json({message:"Authorized Successful!",
            username:authUser.emailAddress,
            name:authUser.firstName});
    }catch(err){
        next(err);
    }
}));



router.post("/users",asyncHandler(async (req,res,next)=>{
    try{
        const newUser = await User.create(req.body);
        res.status(201).end().redirect("/")
    }catch(err){
        if(err.name === "SequelizeValidationError"){
            err.status = 400;
        }
        next(err);
    }
}));



module.exports = router








