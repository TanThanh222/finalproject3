import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

await mongoose.connect("mongodb://127.0.0.1:27017/eduPressDB");

const createAdmin = async () => {
  const exist = await User.findOne({ email: "admin@gmail.com" });

  if (exist) {
    console.log("Admin already exists");
    process.exit();
  }

  const password = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password,
    role: "admin",
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();
