import Extraction from "../model/extraction.model.js"
import User from "../model/user.model"
import { generateEmail } from "../services/mail.service.js"
import Mail from "../model/mail.model.js"


export const generateEmails=async(req,res)=>{
    try {
      const {extractionId} =req.body
      const extraction=await Extraction.findOne({_id:extractionId,createdBy:req.user._id})

      if(!extraction){
        return res.status(404).json({
            message:"Extraction not found"
        })
      }

      const user=await User.findById(req.user._id)

      const studentProfile={
        name:user.name,
        email:user.email,
        role:user.role,
        skills:user.skills,
       }

      const emails=await generateEmail(extraction.data,studentProfile)

      const saveEmails=await Mail.insertMany(emails.map((email,index)=>({
        mailId:Date.now()+index,
        subject:email.subject,
        body:email.body,
        recipientEmail:extraction.data.recruiter_email,
        createdBy:user._id
      })))

      await User.findByIdAndUpdate(req.user._id,{
        $push:{
          mails:{
            $each:saveEmails.map((email)=>{
              email._id
            })
          }
        }
      })

      return res.status(201).json({
        success:true,
        msg:"email generated successfully"
      })
    } catch (err) {
        
    }
}