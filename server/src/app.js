const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

var Post = require("../models/posts");
var Contact = require("../models/contacts");
const validateContact = require("./middleware/validateContact");

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

// DB Setup
var mongoose = require("mongoose");

var DATABASE_URL = process.env.DATABASE_URL || "http://localhost";
mongoose.connect(`mongodb://${DATABASE_URL}/posts`, { useNewUrlParser: true });

var db = mongoose.connection;

db.on("error", function (error) {
  // If first connect fails because server-database isn't up yet, try again.
  // This is only needed for first connect, not for runtime reconnects.
  // See: https://github.com/Automattic/mongoose/issues/5169
  if (
    error.message &&
    error.message.match(/failed to connect to server .* on first connect/)
  ) {
    setTimeout(function () {
      mongoose
        .connect(`mongodb://${DATABASE_URL}/posts`, { useNewUrlParser: true })
        .catch(() => {
          // empty catch avoids unhandled rejections
        });
    }, 20 * 1000);
  } else {
    // Some other error occurred.  Log it.
    console.error(new Date(), String(error));
  }
});

db.once("open", function (callback) {
  console.log("Connection Succeeded");
});

// SERVER Setup
app.get("/posts", (req, res) => {
  Post.find({}, "title description", function (error, posts) {
    if (error) {
      console.error(error);
    }
    res.send({
      posts: posts,
    });
  }).sort({ _id: -1 });
});

// Post Endpoints
app.post("/posts", (req, res) => {
  var db = req.db;
  var title = req.body.title;
  var description = req.body.description;
  var new_post = new Post({
    title: title,
    description: description,
  });

  new_post.save(function (error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true,
      message: "Post saved successfully!",
    });
  });
});

// Fetch single post
app.get("/post/:id", (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, "title description", function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post);
  });
});

// Update a post
app.put("/posts/:id", (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, "title description", function (error, post) {
    if (error) {
      console.error(error);
    }

    post.title = req.body.title;
    post.description = req.body.description;
    post.save(function (error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true,
      });
    });
  });
});

// Delete a post
app.delete("/posts/:id", (req, res) => {
  var db = req.db;
  Post.remove(
    {
      _id: req.params.id,
    },
    function (err, post) {
      if (err) res.send(err);
      res.send({
        success: true,
      });
    },
  );
});

// Contact Endpoints

// Get contacts with pagination and search
app.get("/contacts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.send({
      success: true,
      data: {
        contacts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "获取联系人列表失败",
      error: error.message,
    });
  }
});

// Get single contact
app.get("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).send({
        success: false,
        message: "联系人不存在",
      });
    }
    res.send({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "获取联系人失败",
      error: error.message,
    });
  }
});

// Create contact
app.post("/contacts", validateContact, async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const newContact = new Contact({
      name,
      phone,
      email,
    });

    await newContact.save();
    res.send({
      success: true,
      message: "联系人创建成功",
      data: newContact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "创建联系人失败",
      error: error.message,
    });
  }
});

// Update contact
app.put("/contacts/:id", validateContact, async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).send({
        success: false,
        message: "联系人不存在",
      });
    }

    contact.name = name;
    contact.phone = phone;
    contact.email = email;

    await contact.save();
    res.send({
      success: true,
      message: "联系人更新成功",
      data: contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "更新联系人失败",
      error: error.message,
    });
  }
});

// Delete contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).send({
        success: false,
        message: "联系人不存在",
      });
    }

    res.send({
      success: true,
      message: "联系人删除成功",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "删除联系人失败",
      error: error.message,
    });
  }
});

app.listen(process.env.PORT || 8081);
