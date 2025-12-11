//controlling inner functions of logout,log in...else
import bcrypt from "bcryptjs";
import UserModel from "../models/User.js";

//get and post functions for login
export const getLogin = (req, res) => {
  res.render("login");
};

export const postLogin = async (req, res) => {
  const { emails, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect("/login");
    }

    req.session.isAuth = true;
    req.session.user = user;
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
};
 //get and post functions for registering
export const getRegister = (req, res) => {
  res.render("register");
};

export const postRegister = async (req, res) => {
  const {  name, emails, password } = req.body;

  try {
    let user = await UserModel.findOne({ emails});
    if (user) {
      return res.redirect("/register");
    }

    const hashedPsw = await bcrypt.hash(password, 12);
    user = new UserModel({
      name,
      emails,
      password: hashedPsw,
    });

    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("Server error");
  }
};
 
export const getDashboard = (req, res) => {
  res.render("dashboard", {  name: req.session.user?.name });
};
 
export const postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};















 