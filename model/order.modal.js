const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productDetails: {
      productname: {
        type: String,
        trim: true,
      },
      price: {
        type: Number,
        min: 0,
      },
      quantity: {
        type: Number,
        min: 0,
      },
      description: {
        type: String,
      },
      images: [
        {
          type: String,
        },
      ],
    },

    orderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
