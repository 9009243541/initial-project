const userServices = require("./service.user");
const User = require("./model.user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("./route.user");
require("dotenv").config();
const userController = {};

//register user
userController.registerUser = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.send({
      status: "ERR",
      msg: "name,email,password are required",
      data: null,
    });
  }
  const { data } = await userServices.getUserByEmail(email);
  console.log(data);

  if (data.length) {
    return res.send({ status: "ERR", msg: "email already exists", data: null });
  }

  try {
    const createdUser = await userServices.registerUser({
      name,
      email,
      password,
    });
    if (createdUser.status != "OK") {
      return res.send({
        status: "ERR",
        msg: "something went wrong",
        data: null,
      });
    }
    return res.send({
      status: "OK",
      msg: "user registered successfully",
      data: createdUser.data,
    });
  } catch (err) {
    console.log(err);
    return res.send({ status: "ERR", msg: "something went wrong", data: null });
  }
};
//login user
userController.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res.send({
        status: "ERR",
        msg: "Email and password are required",
        data: null,
      });
    }
    const user = await userServices.findUserByEmailAndPassword(email, password);
    if (user) {
      let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      console.log(token, "token");
      user.password = null;
      return res.send({
        status: "OK",
        msg: "login successfully",
        data: {
          token: token,
          userId: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      return res.send({
        status: "ERR",
        msg: "Invalid email or password ",
        data: null,
      });
    }
  } catch (error) {
    return res.send({
      status: "ERR",
      msg: "Internal server error",
      data: null,
    });
  }
};
//updatePassword ====================================================================
userController.updatePassword = async (req, res) => {
  try {
    //id passsword get
    const { id } = req.params;
    const { oldPassword, password } = req.body;
    if (req._id !== id) {
      res.send({ status: "err", msg: "you are not Authorised" });
    }
    // blank to nhi bheja
    if (!oldPassword || !password) {
      return res.send({
        status: "FAIL",
        msg: "Old password and new password are required",
      });
    }
    //check user
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.send({
        status: "FAIL",
        msg: "user not found",
      });
    }
    //password match
    const isMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isMatched) {
      return res.send({
        status: "FAIL",
        msg: "Old password does not match",
      });
    }

    const newHash = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: newHash }
      // { new: true }
    );
    res.send({
      status: "SUCCESS",
      msg: "Password updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error, "error");
    res.send({
      status: "ERROR",
      msg: "something went wrong",
      data: null,
    });
  }
};
//getUsers
userController.getUsers = async (req, res) => {
  try {
    let getUser = await userServices.getUsers();

    if (!getUser.length) {
      return res.send({
        status: "OK",
        msg: "user not found",
        data: null,
      });
    }
    return res.send({
      status: "OK",
      msg: "User Get successfully",
      data: getUser,
    });
  } catch (error) {
    return res.send({
      status: "Error",
      msg: "something went wrong",
      data: null,
    });
  }
};

//updatUserData
userController.updateUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.send({
        status: "Error",
        msg: "name,eamil,password are required",
        data: null,
      });
    }
    const updateUser = await userServices.updateUserData(id, {
      name,
      email,
      password,
    });
    return res.send({
      status: "ok",
      msg: "user data update successfully",
      data: updateUser,
    });
  } catch (error) {
    return res.send({
      status: "Error",
      msg: "something went wrong",
      data: null,
    });
  }
};

//deleteUser
userController.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await userServices.deleteUser(id, {
      $set: { isDeleted: true },
    });

    if (deleted === null) {
      return res.status(404).send({
        status: "ERR",
        msg: "user Not Found",
        data: null,
      });
    }
    return res.send({
      status: "OK",
      msg: "user deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.log(error);
    return res.send({ status: "Err", msg: "Something went wrong", data: null });
  }
};

module.exports = userController;
