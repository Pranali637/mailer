import express from 'express'
import mongoose from 'mongoose'
import authrouter from './routes/auth.routes.js'
import fileRoutes from "./routes/file.routes.js"
const app = express()
const PORT = 5000
app.use(express.json())

const connectDB = async()=>{
    try {        
        const connection = await mongoose.connect("mongodb+srv://nitin:Nitin%40123@cluster0.9b1ue15.mongodb.net/cold-mailer")
        console.log("MongoDB Connected");
    } catch (e) {
        console.log(e.message)
    }
}
connectDB()
app.use('/api/auth', authrouter)
app.use("/api/files",fileRoutes) 
app.get('/', (req,res) => {
    res.send("Code mailer API is Running")
})

app.listen(PORT, () => {
    console.log(`Server is listening to port : ${PORT}`)
})

