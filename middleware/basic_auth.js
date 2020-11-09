"use strict"
const auth = require("basic-auth");
const {User} = require("../models");
const bcrypt = require("bcryptjs");

//basic-auth middleware
module.exports.authenticateUser = async (req,res,next) => {
    const credentials = auth(req); //include the basic auth()

    let errorMessage; // initial the errors array.

    if(credentials){ // if auth() contains pass and name property
        const theUser = await User.findOne({where:{emailAddress:credentials.name}}); //find the authenticate user

        if(theUser){ // if the user exist
            const authenticated = bcrypt.compareSync(credentials.pass,theUser.password);//compare the plain text password and encrypt password

            if(authenticated){//if plain text password and encrypt password match 
                console.log(`Authentication Successful username ${credentials.name}`);
                req.currentUser = theUser; // pass the currentUser to req object
            }else{
                //if plain text password and encrypted pass not match
                errorMessage = `Authenticated failure! with username ${credentials.name}`;
            }
        }else{
            //if existing User not found
            errorMessage = `User Not Found! with username ${credentials.name}`;
        }
    }else{
        // if no authenticate User
        errorMessage = "Auth Not Found!";
    };

    //handle the error message and response to User
    if(errorMessage){
        console.warn(errorMessage);
        res.status(401).json({message: "Access Denied!"})
    }else{
        next()
    }

};