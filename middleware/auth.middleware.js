import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

export const authMiddleware=async (req,res,next)=>{
    try {
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,process.env.JWT_SECRET)

    const user=await User.findById(decoded.userId)

     if(!user){
        return res.status(401).json({
            msg:"user not found"
        })
     }


     req.user=user
     
     next()
    } catch (error) {
    return res.status(401).json({
        msg:"Invalid token"
    })
    }

}