require("dotenv").config();
const app= require("./app")
const Db=require("./database/db")
Db()

const Port=process.env.PORT || 5000

app.listen(Port,()=>{
    console.log("Server is running")
})
