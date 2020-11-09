//function middleware to handle async routes
module.exports.asyncHandler = (cb) =>{
    return async (req,res,next)=>{
        try{
            //async the callback
            await cb(req,res,next);
        }catch(err){
            //pass error to global error handler
            next(err);
        }
    }
}