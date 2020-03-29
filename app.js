//jshint esversion:6
require('dotenv').config();
const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const mongoose=require("mongoose")
const encrypt=require("mongoose-encryption")


const app=express()
console.log(process.env.API_KEY)
app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true})

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

const secret="Thisissomelittlesecret"  // this is key used for encryption find method will automatically decrypt the password 
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})

const User=new mongoose.model("User",userSchema);

app.get("/",(request,response)=>{
    response.render("home")
})

app.get("/login",(request,response)=>{
    response.render("login")
})

app.get("/register",(request,response)=>{
    response.render("register")
})

app.post("/register",(request,response)=>{
    const newUser=new User({
        email:request.body.username,
        password:request.body.password
    })
    newUser.save((err)=>{
        if(!err){
            response.render("secrets")
        } else {
            console.log(err)
        }
    })
})

app.post("/login",(request,response)=>{
    const username=request.body.username
    const password=request.body.password
    User.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err)
        } else {
            if(foundUser){
                if(foundUser.password==password){
                    console.log(foundUser.password)
                    response.render("secrets")
                  
                }
                else{
                    console.log("Password do not match")
                    console.log(foundUser.password)
                
                }
            }
        }
    })
})



app.listen(3000,()=>{
    console.log("Server started on port 3000")
})