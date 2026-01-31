

const protect=async (req,res,next)=>{
    console.log('Session ID:', req.sessionID);
    console.log('Session data:', req.session);
    
    const {isLoggedIn,userId}=req.session;

    if(!isLoggedIn || ! userId){
        console.log('Auth failed - isLoggedIn:', isLoggedIn, 'userId:', userId);
        return res.status(401).json({message:"Your are not logged In"})
    }

    next()
}

export default protect