const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productname: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      status: {
        type: Number,
        enum: [1, 2, 3],
        default: 1,
      },
    },

    discount: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
    },
    rating: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("Product", productSchema);
