const express = require("express");
const cors = require("cors");
const userRouter = require("./router/user.router");
const loginRouter=require("./router/authrouter")
const productRouter=require("./router/product.router")
const DashboardRouter=require("./router/dashboard.router")
const DropDownRouter=require("./router/dropDownRouter")
const OrderRouter=require("./router/orderouter")

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", userRouter);
app.use("/api",loginRouter);
app.use("/api",productRouter);
app.use("/api",DashboardRouter)
app.use("/api",DropDownRouter)
app.use("/api",OrderRouter)
module.exports = app;
