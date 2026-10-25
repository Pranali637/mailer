import User from "../model/user.model.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()

export const registerUser = async(req, res) => {
    try {
        const {name, email, password, domain, skills} = req.body

        if(!name || !email || !password){
            return res.status(400).json({message : "email, name, password required"})
        }
        if(password.length < 8){
            return res.status(400).json({message : "password is less than 8 char"})
        }
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message : "User already exist"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email, 
            password : hashedPassword,
            domain,
            skills
        })
        return res.status(201).json(user, {message : "User created Successfully"})
        
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({message : "Internal Server Error"})
    }
}

export const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({message : "Invalid user or password"})
        }
        const ismatch = await bcrypt.compare(password, user.password)
        if(!ismatch){
            return res.status(400).json({message : "Invalid user or password"})
        }

        const token=jwt.sign(
            {
                userId:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )

        return res.status(200).json(
            {
            message : "User Login Successfully",
            user,
            token
            })

    } catch (e) {
        console.log(e.message)
        return res.status(500).json({message : "Internal Server Error"})
        
    }
}