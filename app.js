const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.router");
const loginRouter=require("./routes/authrouter")
const productRouter=require("./routes/product.router")
const DashboardRouter=require("./routes/dashboard.router")
const DropDownRouter=require("./routes/dropDownRouter")
const OrderRouter=require("./routes/orderouter")

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
