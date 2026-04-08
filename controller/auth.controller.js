const User=require("../model/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const login=async(req,res)=>{
    try{
      const {email,password}=req.body
      const normalemail=typeof email==="string"?email.trim().toLowerCase():email;
      const missingField=!email?"email":!password?"password":null
      if(missingField){
        return res.status(400).json({
            message:`${missingField} is Required `
        });
      }

      const userExists=await User.findOne({
        email:normalemail
      })

      if(!userExists){
        return res.status(400).json({
            message:"user not found"
        })
      }
      const passwordCheck=await bcrypt.compare(password,userExists.password)

      if(passwordCheck===false){
        return res.status(401).json({
            message:"invalid credentials"
        })
      }

      const token=jwt.sign(
        {id:userExists._id,email:userExists.email},
        process.env.MYFRIEND,
        {expiresIn:"7d"}
      )
    
      const data=userExists.toObject()
      delete data.password

      return res.status(200).json({
        message:"login sucess fully",
        token,
        data
      })
      
    }catch(err){
    console.error("login error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
}


module.exports={login}
