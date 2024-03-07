const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const app = express();
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secret = "as123skdfh2387sad7";
const cookieParser = require("cookie-parser");

//creating post
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const Post = require("./models/Post");

//mongoDB
//Name of the project: MongoMayuresh
// username: iammayureshkshirsagar2000
// password: 49cHc2R8I5TENAHj
// const url = "mongodb+srv://iammayureshkshirsagar2000:49cHc2R8I5TENAHj@mayureshcluster1.cazu15s.mongodb.net/?retryWrites=true&w=majority&appName=MayureshCluster1";

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))

const url =
  "mongodb+srv://iammayureshkshirsagar2000:49cHc2R8I5TENAHj@mayureshcluster1.cazu15s.mongodb.net/BlogApp?retryWrites=true&w=majority&appName=MayureshCluster1";
mongoose.connect(url);

app.post("/register", async (req, res) => {
  console.log("I am in /register");
  console.log(req.body);
  try {
    const { username, password } = req.body;
    const userDoc = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    console.log("Error: data is not according to schema");
    console.log(error);
    res.status(400).json("Error: data is not according to schema");
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    const userDoc = await UserModel.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    console.log("password match: ", passOk);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json("wrong credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("user not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  console.log("we are in profile page", token);
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newpath;
  if (req.file) {
    console.log("following is the request");
    console.log(req.file);
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    console.log("this is parts: ", parts);
    const ext = parts[parts.length - 1];
    console.log("this is ext: ", ext);
    newpath = path + "." + ext;
    console.log("this is new path", newpath);
    fs.renameSync(path, newpath);
  }

  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postData = { title, summary, content, author: info.id };
      if (newpath) {
        postData.cover = newpath;
      }
      const postDoc = await Post.create(postData);
      res.json(postDoc);
    });
  } catch (err) {
    console.log("Data is not according to schema or maybe some other err");
    res
      .status(400)
      .json("data is not according to schema or maybe some other error. following is the error: ", err);
  }
});



app.put("/post/:id", uploadMiddleware.single("file"), async (req, res) => {
  const {id} = req.params
  let newpath;
  if (req.file) {
    console.log("following is the request");
    console.log(req.file);
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    console.log("this is parts: ", parts);
    const ext = parts[parts.length - 1];
    console.log("this is ext: ", ext);
    newpath = path + "." + ext;
    console.log("this is new path", newpath);
    fs.renameSync(path, newpath);
  }

  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      console.log("I am inside jwt verification -----------------------")
      console.log("this is the token", info)
      const { title, summary, content } = req.body;

      const postDoc = await Post.findById(id)
      console.log("this is the postDoc ", JSON.stringify(postDoc))

      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)

      if(!isAuthor) {
        return res.status(400).json('you are not the authorized person')
      }

      const postData = { title, summary, content, author: info.id };

      if (newpath) {
          postData.cover = newpath;
        }else{
          postData.cover = postDoc.cover;
        }

      await Post.updateOne({ _id: id }, postData);

      res.json("successfully edited")

    });
  } catch (err) {
    console.log("Data is not according to schema or maybe some other err");
    res
      .status(400)
      .json("data is not according to schema or maybe some other error. following is the error: ", err);
  }

});




app.get("/post", async (req, res) => {
  const posts = await Post.find()
                          .populate('author', ['username'])
                          .sort({createdAt: -1})
                          .limit(20);
  res.json(posts);
});

app.get("/post/:id",async (req,res) => {
  const {id} = req.params
  const post = await Post.findById(id).populate('author', ['username'])
  res.json(post)
})

app.listen(3001, () => console.log("server is listening on port 3001"));
