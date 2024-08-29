const User = require("./model.user");
const bcrypt = require("bcrypt");
const UserServices = {};

UserServices.registerUser = async ({ name, email, password }) => {
  console.log("underRegister ");
  try {
    console.log("first");
    const hash = bcrypt.hashSync(password, 10);

    let newUser = await User.create({ name, email, password: hash });
    console.log(newUser, "newUser");
    return { status: "OK", data: newUser };
  } catch (err) {
    return { status: "ERR", data: null, error: err };
  }
};
UserServices.getUserByEmail = async (email) => {
  try {
    const user = await User.find({ email });
    return { status: "OK", data: user, error: null };
  } catch (err) {
    console.log(err);
    return { status: "ERR", data: [], error: err };
  }
};

UserServices.findUserByEmailAndPassword = async (email, password) => {
  console.log(password, email, "daat");
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user) {
      let { password: hash } = user;
      let isMatched = await bcrypt.compare(password, hash);
      if (isMatched) {
        console.log("check");
        return user;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

UserServices.getUsers = async () => {
  return User.find({});
};
// UserServices.finduser = async (matchField) => {
//   return User.findOne({ matchField });
// };
UserServices.deleteUser = async (id, updateFeild) => {
  return User.findByIdAndUpdate({ _id: id }, { ...updateFeild }, { new: true });
};
UserServices.updateUserData = async (id, { name, email, password }) => {
  const hash = bcrypt.hashSync(password, 10);
  return User.findByIdAndUpdate({ _id: id }, { name, email, password:hash });
};

// UserServices.loginUser=async(email,password)=>{
// return User.findOne({email,password})
// }
module.exports = UserServices;
