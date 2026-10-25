import cloudinary from "../config/cloud.config.js"
import File from "../model/file.models.js"
import User from "../model/user.model.js"
export const uploadFile=async(req,res)=>{
    try {
        if(!req.file){
            return res.status(401).json({
                success:false,
                msg:"file is required"
            })
        }

        const {fileName}=req.body
        if(!fileName){
            return res.status(401).json({
                success:false,
                msg:"file name is required"
            }) 
        }

        const result=await new Promise((resolve,reject)=>{
            const stream=cloudinary.uploader.upload_stream({
                folder:"files",
                resource_type:"auto"
            },
            (error,result)=>{
                if(error)return reject(error)
                else resolve(result)   
            }
        )
          stream.end(req.file.buffer)
        })

        const file=await File.create({
            fileName,
            fileURL:result.secure_url,
            createdBy:req.user._id
        })
      await User.findByIdAndUpdate(req.user._id,{
        $push:{
            files:file._id
        }
      })


      return res.status(201).json({
        success:true,
        msg:"file uploaded successfully",
        file
      })
    } catch (error) {
        console.log("error in file uploading:",error.message)

        return res.status(500).json({
        success:false,
        msg:"Internal server error",
       
      })
    }
}