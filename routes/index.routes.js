const express = require('express');
const router = express.Router(); 


const {
  dashBoard,
  loginPage,
  loginUser,
  logout,
  profilePage,
  changePassword,
  changePasswordPage
} = require("../controllers/UserController");


router.get("/", loginPage);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/dashboard", dashBoard);    
router.get("/profile", profilePage); 
router.get("/change-password", changePasswordPage);
router.post("/change-password", changePassword);


router.use("/blog", require('./blog.routes')); 
router.use("/user", require("./user.routes")); 

module.exports = router;
