const express=require ("express")
const {createUser,getuser,deleteUser,updateUser}=require("../controller/user.controller")
const authMiddleware=require("../middleware/authMiddleware")


const router=express.Router()
router.post("/createuser",createUser)
router.get("/users",authMiddleware,getuser)
router.delete("/users/:id",authMiddleware,deleteUser)
router.put("/users/:id",authMiddleware,updateUser)

module.exports =router