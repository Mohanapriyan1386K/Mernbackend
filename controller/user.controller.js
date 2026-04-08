const User = require("../model/user.model");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { name, user_name, password, email } = req.body;
    const missingField = !name
      ? "name"
      : !user_name
        ? "user_name"
        : !email
          ? "email"
          : !password
            ? "password"
            : null;

    if (missingField) {
      return res.status(400).json({
        message: `${missingField} is required`,
      });
    }


    const normEmail =
      typeof email === "string" ? email.trim().toLowerCase() : email;
    const normUserName =
      typeof user_name === "string"
        ? user_name.trim().toLowerCase()
        : user_name;

    const hashpassword = await bcrypt.hash(password, 10);

    const userExists = await User.findOne({
      $or: [{ email: normEmail }, { user_name: normUserName }],
    });

    if (userExists) {
      let message = "";

      if (userExists.email === normEmail) {
        message = "Email already exists";
      } else if (userExists.user_name === normUserName) {
        message = "Username already exists";
      }

      console.warn("createUser 409 conflict:", {
        email: normEmail,
        user_name: normUserName,
        existingId: String(userExists._id),
        conflict: message || "User already exists",
      });

      return res
        .status(409)
        .json({ message: message || "User already exists" });
    }
    const user = new User({
      name,
      user_name: normUserName,
      email: normEmail,
      password: hashpassword,
    });
    await user.save();

    const data = user.toObject();
    delete data.password;

    res.status(201).json({
      message: "User created successfully",
      data,
    });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getuser = async (req, res) => {
  try {
    let { page, limit, name, user_name, email } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const filter= {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (user_name) filter.user_name = { $regex: user_name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };

    const users = await User.find(filter).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments(filter);

    return res.status(200).json({
      message: "User data fetched successfully",
      data: users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, user_name, email, password } = req.body; // destructure password if provided

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email already exists for another user
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
      user.email = email.trim().toLowerCase();
    }

    // Check if username already exists for another user
    if (user_name && user_name !== user.user_name) {
      const existingUsername = await User.findOne({ user_name: user_name.trim().toLowerCase() });
      if (existingUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }
      user.user_name = user_name.trim().toLowerCase();
    }

    // Update name if provided
    if (name) user.name = name;

    // Only update password if explicitly provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const data = user.toObject();
    delete data.password; // never send password back

    res.status(200).json({
      message: "User updated successfully",
      data,
    });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // User ID from URL
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUser, getuser, updateUser, deleteUser };
