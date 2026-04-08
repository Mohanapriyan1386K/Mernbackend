const {CategoryDropDown} =require("../controller/DropDown.controller")
const authMiddleware =require("../middleware/authMiddleware")
const express=require("express")
const router=express.Router()
router.get("/categorydropdown",authMiddleware,CategoryDropDown)
module.exports= router