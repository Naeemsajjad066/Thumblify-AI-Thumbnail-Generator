
import Thumbnail from "../models/Thumbnail.js";
// controllers to get all user thumbnails

export const getUsersThumbnails=async (req,res)=>{
    try {
        const {userId}=req.session;
        const thumbnail=await Thumbnail.find({userId}).sort({createdAt:-1})

        res.json({thumbnail})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}


// controller to get single thumbnail of user

export const getThumbnailbyId=async (req,res)=>{
    try {
     const {userId}=req.session;
     const {id}=req.params;
    
    const thumbnail=Thumbnail.findOne({userId,_id:id})   
       res.json({thumbnail})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}