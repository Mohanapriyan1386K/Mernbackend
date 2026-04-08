const Dashboard =require("../controller/Dashboard.controller")
const express=require("express")
const router=express.Router()
const middleware=require("../middleware/authMiddleware")
router.get("/dashboard",middleware,Dashboard)
module.exports=router