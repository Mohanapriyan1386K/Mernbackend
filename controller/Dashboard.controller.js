const Product = require("../model/product.model");
const User = require("../model/user.model");
const Category = require("../model/category.model");

const Dashboard = async (req, res) => {
  try {
    const [userCount, productCount, categoryCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
    ]);

    return res.status(200).json({
      message: "Dashboard data fetched successfully",
      data: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalCategory: categoryCount,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = Dashboard;