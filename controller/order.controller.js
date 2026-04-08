const mongoose = require("mongoose");
const Order = require("../model/order.modal");
const Product = require("../model/product.model");
const User = require("../model/user.model");

// create order
const createOrder = async (req, res) => {
  try {
    const { user, product, orderQuantity, status, productDetails } =
      req.body || {};

    const missingfield = !user ? "user" : !product ? "product" : null;
    if (missingfield) {
      return res.status(422).json({
        message: `${missingfield} is required`,
      });
    }

    if (!mongoose.isValidObjectId(user)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!mongoose.isValidObjectId(product)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingProduct = await Product.findById(product);
    if (!existingProduct || existingProduct.isDeleted) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const details =
      productDetails && typeof productDetails === "object"
        ? productDetails
        : {
            productname: existingProduct.productname,
            price: existingProduct.price,
            quantity: existingProduct.quantity,
            description: existingProduct.description,
            images: existingProduct.images || [],
          };

    const newOrder = new Order({
      user,
      product,
      productDetails: details,
      orderQuantity: orderQuantity ?? 1,
      status: status || "pending",
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// update order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, product, orderQuantity, status, productDetails } =
      req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);
    if (!order || order.isDeleted) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (user) {
      if (!mongoose.isValidObjectId(user)) {
        return res.status(400).json({
          message: "Invalid user ID",
        });
      }
      const existingUser = await User.findById(user);
      if (!existingUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      order.user = user;
    }

    if (product) {
      if (!mongoose.isValidObjectId(product)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }
      const existingProduct = await Product.findById(product);
      if (!existingProduct || existingProduct.isDeleted) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      order.product = product;
      if (!productDetails) {
        order.productDetails = {
          productname: existingProduct.productname,
          price: existingProduct.price,
          quantity: existingProduct.quantity,
          description: existingProduct.description,
          images: existingProduct.images || [],
        };
      }
    }

    if (productDetails && typeof productDetails === "object") {
      order.productDetails = productDetails;
    }

    order.orderQuantity =
      orderQuantity ?? order.orderQuantity;
    order.status = status ?? order.status;

    await order.save();

    return res.status(200).json({
      message: "Order updated successfully",
    });
  } catch (err) {
    console.error("updateOrder error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// get orders with filter and pagination
const getOrders = async (req, res) => {
  try {
    let { page, limit, status, user, product } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const match = { isDeleted: false };

    if (status) {
      match.status = status;
    }

    if (user) {
      if (!mongoose.isValidObjectId(user)) {
        return res.status(400).json({
          message: "Invalid user ID",
        });
      }
      match.user = user;
    }

    if (product) {
      if (!mongoose.isValidObjectId(product)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }
      match.product = product;
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(match)
        .populate("user", "name email user_name")
        .populate("product", "productname price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(match),
    ]);

    return res.status(200).json({
      message: "Orders fetched successfully",
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      page,
      limit,
      orders,
    });
  } catch (err) {
    console.error("getOrders error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// delete order (soft delete)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);
    if (!order || order.isDeleted) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.isDeleted = true;
    await order.save();

    return res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("deleteOrder error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getOrders,
  deleteOrder,
};
