const express = require("express");

const userController = require("./controller.user");

const router = express.Router();
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/getUser", userController.getUsers);
router.delete("/delete/:id", userController.deleteUser);

// router.patch("/updateProfile/:id", userController.UpdateProfile);
// router.patch("/updatePassword/:id", userController.updatePassword);

module.exports = router;
