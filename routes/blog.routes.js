const express = require("express");
const router = express.Router();
const blogController = require("../controllers/BlogController"); 

const upload = require("../middleware/uploadImage"); 


router.get("/add-blog", blogController.addBlogPage);
router.post("/add-blog", upload.single("image"), blogController.addNewBlog);
router.get("/view-all-blogs", blogController.viewAllBlogsPage); 
router.get("/my-blogs", blogController.MyBlogsPage); 
router.get("/single-blog/:id", blogController.viewSingleBlog); 
router.get("/edit-blog/:id", blogController.editBlogPage); 
router.post("/update-blog/:id", upload.single("image"), blogController.updateBlog); 
router.get("/delete-blog/:id", blogController.deleteBlog); 
router.get("/edit-blog/:id", blogController.editBlogPage);

router.post("/update-blog/:id",
upload.single("image"), blogController.updateBlog);


module.exports = router;