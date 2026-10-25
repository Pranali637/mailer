import mongoose from "mongoose";

const mailSchema=new mongoose.Schema({
mailId:{
    type:Number,
    required:true
},
subject:{
    type:String,
    required:true
},
body:{
    type:String,
    required:true,
    trim:true
},
recipientMail:{
    type:String,
    default:""
},
createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
}
},{timestamps:true})

const Mail=mongoose.model("Mail",mailSchema)
export default Mail