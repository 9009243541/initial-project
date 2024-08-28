const userServices = require("./service.user");
const User = require("./model.user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("./route.user");
require("dotenv").config();
const userController = {};
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
      return res.status(200).send({
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
      return res
        .status(500)
        .send({ status: "ERR", msg: "Invalid email or password ", data: null });
    }
  } catch (error) {
    return res.status(500).send({
      status: "ERR",
      msg: "Internal server error",
      data: null,
    });
  }
};
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
// userController.UpdateProfile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (id) {
//       const { name, email, password } = req.body;
//       const user = await User.findOneAndUpdate(
//         { _id: id },
//         { name, email },
//         { new: true }
//       );
//       console.log(user);
//       console.log(id);
//       console.log(name, email, password);
//       res
//         .status(200)
//         .send({ status: "OK", msg: "update successfully", data: user });
//     } else {
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
userController.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // if (!id) {
    //   return res
    //     .status(400)
    //     .send({ status: "Err", msg: "Invalid ID", data: null });
    // }

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
    return res
      .status(200)
      .send({ status: "OK", msg: "user deleted successfully", data: deleted });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: "Err", msg: "Something went wrong", data: null });
  }
};

module.exports = userController;
