// server.js
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/DbConnection");
const indexRoutes = require("./routes/index.routes");
const blogRoutes = require("./routes/blog.routes"); 


dbConnect();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use("/", indexRoutes); 
app.use("/blog", blogRoutes); 


app.use((req, res) => {
  res.status(404).send("Page Not Found");
});


const port = 9005;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
