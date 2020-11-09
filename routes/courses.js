"use strict"
const express = require("express");
const router = express.Router();
const {asyncHandler} = require("../middleware/asyncHandler");
const { Course,User} = require("../models");
const {authenticateUser} = require("../middleware/basic_auth");

//courses get router with asyncHandler middleware
router.get("/courses",asyncHandler(async (req,res,next)=>{
    try{
        // get all the courses data and it's associate user detail
        const allCourses = await Course.findAll({
            include:[{
                model: User,
                as:"authenticateUser",
                attributes: ["id","firstName","lastName","emailAddress"]
            }],
            attributes:["id","title","description","estimatedTime","materialsNeeded"]
        });
    
        res.status(200).json({allCourses})
    }catch(err){
        next(err);
    }
}));

//course get courses/:id route with asyncHandler middleware
router.get("/courses/:id",asyncHandler(async (req,res,next)=>{
    try{
        //get certain course with it's associate user detail
        const id = req.params.id;
        const course = await Course.findAll({
            attributes:["id","title","description","estimatedTime","materialsNeeded"],
            where:{id},
            include:[{
                model:User,
                as:"authenticateUser",
                attributes: ["id","firstName","lastName","emailAddress"]
            }]
        });
        res.status(200).json({course});
    }catch(err){
        next(err);
    }
}));

//course post route with authenticateUser and asyncHandler middleware
router.post("/courses",authenticateUser,asyncHandler(async (req,res,next)=>{
    try{
        // add new course
        const newCourse = await Course.create(req.body);
        //get new course id 
        const newCourseJson = newCourse.get({plain:true});
        const id = newCourseJson.id;
        //set header location to current course
        res.status(201).location(`/course/${id}`).end();
    }catch(err){
        //handler SequelizeValidationError
        if(err.name === "SequelizeValidationError"){
            err.status = 400;
        }
        next(err);
    }
}));

//course put route with authenticateUser and asyncHandler middleware
router.put("/courses/:id",authenticateUser,asyncHandler(async (req,res,next)=>{
    try{
        //get authenticated User
        const currentUser = req.currentUser; 
        //get id value on url
        const id = req.params.id;
        //retrieve needs update course with findByPk.
        const updateCourse = await Course.findByPk(id);

        //check if authenticated User is belong to the Updated course.
        if(currentUser.id === updateCourse.userId){
            const updateDate = req.body;
            //handling validation errors
            let errors = [];
            if(!updateDate.title){
                errors.push("Please provide a title property value")
            };
    
            if(!updateDate.description){
                errors.push("Please provide a description value")
            };
    
            if(errors.length > 0){
                res.status(400).json({message:errors})
            }else{
                updateCourse.update(req.body);
                res.status(204).end();
            };
        }else{
            res.status(403).json({message: `unauthorized to update username: ${currentUser.emailAddress}`})
        }

    }catch(err){
        if(err.name === "SequelizeValidationError"){
            err.status = 400;
        };
        next(err);
    }
}))

//course delete route with authenticateUser and asyncHandler middleware
router.delete("/courses/:id",authenticateUser,asyncHandler(async (req,res,next)=>{
    try{
        //get authenticated User
        const currentUser = req.currentUser; 
        //get id value
        const id = req.params.id;
        // find targeting course with findByPk
        const deleteCourse = await Course.findByPk(id);

        //check if the Authenticate user is authorized to delete
        if(currentUser.id === deleteCourse.userId){
            deleteCourse.destroy();
            res.status(204).end();
        }else{
            res.status(403).json({message: `unauthorized to delete username: ${currentUser.emailAddress}`})
        }

    }catch(err){
        next(err);
    }
}))


module.exports = router