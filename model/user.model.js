import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  domain: {
    type: String,
    default: "",
  },
  skills : [
    {
        type : String,
        trim : true
    }
  ]
  ,

  files:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"File",
    required:true
  }],

  mails:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Mail",
    required:true
  }]
});


const User = new mongoose.model("User", userSchema)
export default User;