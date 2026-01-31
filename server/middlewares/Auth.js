

const protect=async (req,res,next)=>{
    const {isLoggedIn,userId}=req.session;

    if(!isLoggedIn || ! userId){
        return res.status(401).json({message:"Your are not logged In"})
    }

    next()
}

export default protect