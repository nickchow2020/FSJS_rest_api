"use strict"
const express = require("express");
const router = express.Router();
const {asyncHandler} = require("../middleware/asyncHandler");
const { Course,User} = require("../models");
const {authenticateUser} = require("../middleware/basic_auth");


router.get("/courses",asyncHandler(async (req,res,next)=>{
    try{
        const allCourses = await Course.findAll({
            include:[{
                model: User,
                as:"authenticateUser"
            }]
        });
    
        res.status(200).json({allCourses})
    }catch(err){
        next(err);
    }
}));


router.get("/courses/:id",asyncHandler(async (req,res,next)=>{
    try{
        const id = req.params.id;
        const course = await Course.findAll({
            where:{id},
            include:[{
                model:User,
                as:"authenticateUser"
            }]
        });
        res.status(200).json({course});
    }catch(err){
        next(err);
    }
}));


router.post("/courses",authenticateUser,asyncHandler(async (req,res,next)=>{
    try{
        const newCourse = await Course.create(req.body);
        res.status(201).end().redirect("/");
    }catch(err){
        if(err.name === "SequelizeValidationError"){
            err.status = 400;
        }
        next(err);
    }
}));


router.put("/courses/:id",authenticateUser,asyncHandler(async (req,res,next)=>{
    try{
        const updateDate = req.body;
        let errors = [];
        if(!updateDate.title){
            errors.push("Please provide a title property value")
        }

        if(!updateDate.description){
            errors.push("Please provide a description value")
        }

        if(errors.length > 0){
            res.status(400).json({message:errors})
        }else{
            const id = req.params.id;
            const updateCourse = await Course.findByPk(id);
            updateCourse.update(req.body);
            res.status(204).end();
        };

    }catch(err){
        if(err.name === "SequelizeValidationError"){
            err.status = 400;
        }
        next(err);
    }
}))


router.delete("/courses/:id",authenticateUser,asyncHandler(async (req,res,next)=>{
    try{
        const id = req.params.id;
        const deleteCourse = await Course.findByPk(id);
        deleteCourse.destroy();
        res.status(204).end();
    }catch(err){
        next(err);
    }
}))


module.exports = router