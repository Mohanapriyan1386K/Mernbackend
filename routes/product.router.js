const express= require("express")
const router =express.Router()
const authMiddleware=require("../middleware/authMiddleware")
const {createProduct,getproduct,updateProduct,deleteProduct}=require("../controller/product.controller")
router.post("/addproduct",authMiddleware,createProduct)
router.get("/getproduct",authMiddleware,getproduct)
router.put("/updateproduct/:id",authMiddleware,updateProduct)
router.delete("/deleteproduct/:id",authMiddleware,deleteProduct)    
module.exports=router