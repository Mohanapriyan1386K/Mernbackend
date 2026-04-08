require("dotenv").config();
const app= require("./app")
const Db=require("./database/db")
Db()

const Port=3000

app.listen(Port,()=>{
    console.log("Server is running")
})
