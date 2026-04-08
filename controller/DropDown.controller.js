const Category =require("../model/category.model")
const CategoryDropDown=async(req,res)=>{
     const dropdowndata=await Category.find()
     return res.status(200).json(
        {message:"categroy fetched sucess fully",data:dropdowndata}
     )
}

module.exports={
    CategoryDropDown
}