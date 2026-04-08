const mongoose = require("mongoose");
const Product = require("../model/product.model");
const Category = require("../model/category.model");

//create product
const createProduct = async (req, res) => {
  try {
    const {
      productname,
      price,
      quantity,
      description,
      category,
      images,
      status,
      discount,
      sku,
    } = req.body;

    const missingfield = !productname
      ? "productname"
      : price === undefined
        ? "price"
        : description === undefined
          ? "description"
          : null;

    if (missingfield) {
      return res.status(422).json({
        message: `${missingfield} is required`,
      });
    }

    const existingProduct = await Product.findOne({
      productname: { $regex: `^${productname}$`, $options: "i" },
      isDeleted: false,
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "Product name already exists",
      });
    }

    if (sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return res.status(409).json({
          message: "SKU already exists",
        });
      }
    }

    let categoryId = null;
    if (category) {
      if (typeof category === "object") {
        categoryId = category._id || category.id || null;
      } else {
        categoryId = category;
      }

      if (!mongoose.isValidObjectId(categoryId)) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }

      const isValidCategory = await Category.findById(categoryId);
      if (!isValidCategory) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }
    }

    const newProduct = new Product({
      productname,
      price,
      quantity: quantity ?? 0, // allows 0
      description,
      category: categoryId || null,
      images: images || [],
      status: status || 1,
      discount: discount || 0,
      sku: sku || `SKU-${Date.now()}`,
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (err) {
    console.error("createProduct error:", err);
    if (err && err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern || {})[0] || "field";
      return res.status(409).json({
        message: `${duplicateField} already exists`,
      });
    }
    res.status(500).json({
      message: "Server error",
    });
  }
};

///update product

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productname,
      price,
      quantity,
      description,
      category,
      images,
      status,
      discount,
      sku,
    } = req.body;

    const product = await Product.findById(id);
    if (!product || product.isDeleted) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const missingfield = !productname
      ? "productname"
      : price == null
      ? "price"
      : description == null
      ? "description"
      : null;

    if (missingfield) {
      return res.status(422).json({
        message: `${missingfield} is required`,
      });
    }

    if (sku) {
      const existingSku = await Product.findOne({
        _id: { $ne: id },
        sku,
      });
      if (existingSku) {
        return res.status(409).json({
          message: "SKU already exists",
        });
      }
    }

    let categoryId = product.category;

    if (category) {
      if (typeof category === "object") {
        categoryId = category._id || category.id;
      } else {
        categoryId = category;
      }

      if (!mongoose.isValidObjectId(categoryId)) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }

      const isValidCategory = await Category.findById(categoryId);
      if (!isValidCategory) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }
    }

    const existingProduct = await Product.findOne({
      _id: { $ne: id },
      productname: { $regex: `^${productname}$`, $options: "i" },
      isDeleted: false,
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "Product name already exists",
      });
    }

    product.productname = productname;
    product.price = price;
    product.quantity = quantity ?? product.quantity;
    product.description = description;
    product.category = categoryId;
    product.images = images ?? product.images;
    product.status = status ?? product.status;
    product.discount = discount ?? product.discount;
    product.sku = sku ?? product.sku;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
    });

  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

////get product with filter and pagination and sorting

const getproduct = async (req, res) => {
  try {
    let { page, limit, productname, minPrice, maxPrice, sort } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    const match = {
      isDeleted: false,
    };

    if (productname) {
      match.productname = { $regex: productname, $options: "i" };
    }

    if (minPrice || maxPrice) {
      match.price = {};
      if (minPrice) match.price.$gte = Number(minPrice);
      if (maxPrice) match.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_low") sortOption = { price: 1 };
    if (sort === "price_high") sortOption = { price: -1 };

    const productsAggregate = await Product.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      { $sort: sortOption },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const products = productsAggregate[0].data;

    const totalProducts = productsAggregate[0].totalCount[0]?.count || 0;

    return res.status(200).json({
      message: "Products fetched successfully",
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      page,
      limit,
      products,
    });
  } catch (err) {
    console.error("getproduct error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findById(id);
    if (!product || product.isDeleted) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    product.isDeleted = true;
    await product.save();
    return res.status(200).json({
      message: "Product deleted successfully",
    });
  
  }catch (err) {
    console.error("deleteProduct error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createProduct,
  getproduct,
  updateProduct,
  deleteProduct
};
