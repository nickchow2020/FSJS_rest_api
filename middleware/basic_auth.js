"use strict"
const auth = require("basic-auth");
const {User} = require("../models");
const bcrypt = require("bcryptjs");

module.exports.authenticateUser = async (req,res,next) => {
    const credentials = auth(req);

    let errorMessage;

    if(credentials){
        const theUser = await User.findOne({where:{emailAddress:credentials.name}});

        if(theUser){
            const authenticated = bcrypt.compareSync(credentials.pass,theUser.password);

            if(authenticated){
                console.log(`Authentication Successful username ${credentials.name}`);
                req.currentUser = theUser;
            }else{
                errorMessage = `Authenticated failure! with username ${credentials.name}`;
            }
        }else{
            errorMessage = `User Not Found! with username ${credentials.name}`;
        }
    }else{
        errorMessage = "Auth Not Found!";
    };

    if(errorMessage){
        console.warn(errorMessage);
        res.status(401).json({message: "Access Denied!"})
    }else{
        next()
    }

};