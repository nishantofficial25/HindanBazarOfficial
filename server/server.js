// server.js
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
require("dotenv").config();
const cors = require("cors");
const conditionRoutes = require("./routes/conditions.js");

app.use(express.json());
app.use(cors());
// Public uploads folder
const UPLOADS_FOLDER = path.join(__dirname, "public", "uploads");
app.use("/uploads", express.static(UPLOADS_FOLDER));

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  picture: String, // filename of profile image
  mob: String,
  location: String,
});
const User = mongoose.model("User", userSchema);

const DataSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  Category: String,
  owner: {
    Username: String,
    mob: Number,
    location: String,
  },
  emails: String,
  old: String,
});
const Data = mongoose.model("Listing", DataSchema);

const ImageSchema = new mongoose.Schema({
  filename: String, // only filename stored
  type: String,
  productId: String,
});
const Images = mongoose.model("Image", ImageSchema);

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Routes
app.get("/", (req, res) => res.send("API Working!"));

//SahiPhoto /////////////////////////
app.use("/api/conditions", conditionRoutes);
////////////////////////////////////

// Sign up user
app.post("/signUp", async (req, res) => {
  try {
    const { name, email, mobile, profileImage, location } = req.body;
    const newUser = new User({
      name,
      email,
      picture: profileImage,
      mob: mobile,
      location,
    });
    await newUser.save();
    res.redirect(`https://hindanbazar.cloud/`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Get all users
app.get("/userDetails", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json({ details: allUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products with pagination
app.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const skip = page * limit;

    const allData = await Data.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Data.countDocuments();
    const hasMore = skip + limit < total;

    // Fetch first image per product
    const allImg = [];
    for (let i = 0; i < allData.length; i++) {
      const newArr = await Images.find({ productId: allData[i]._id }).limit(1);
      allImg.push(newArr);
    }

    const flattenedArray = allImg.flat();
    const convertedImg = flattenedArray.map((img) => ({
      filename: img.filename,
      type: img.type,
      productID: img.productId,
    }));

    res.json({ details: allData, images: convertedImg, hasMore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to compress image to ~40KB
async function compressImage(inputPath, outputPath) {
  let quality = 60;
  let buffer = await sharp(inputPath)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();

  while (buffer.length > 40 * 1024 && quality > 10) {
    quality -= 5;
    buffer = await sharp(inputPath)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
  }

  await fs.promises.writeFile(outputPath, buffer);
}

// Upload product
app.post("/upload", upload.array("image", 10), async (req, res) => {
  try {
    const newData = new Data({
      title: req.body.title,
      description: req.body.desc,
      price: req.body.price,
      Category: req.body.cat,
      owner: {
        Username: req.body.name,
        mob: req.body.mob,
        location: req.body.location,
      },
      emails: req.body.email,
      old: req.body.old,
    });

    const savedData = await newData.save();
    const productID = savedData._id.toString();

    const files = req.files;
    for (const file of files) {
      const outputFilename = `${Date.now()}-${file.originalname.replace(
        /\s/g,
        "_"
      )}.webp`;
      const outputPath = path.join(UPLOADS_FOLDER, outputFilename);

      await compressImage(file.path, outputPath);
      fs.unlinkSync(file.path); // delete original

      const newImage = new Images({
        filename: outputFilename,
        type: "image/webp",
        productId: productID,
      });
      await newImage.save();
    }

    res
      .status(201)
      .json({ message: "Product uploaded and compressed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Edit product
app.post("/edit/:id", upload.array("image", 10), async (req, res) => {
  
  try {
    const productId = req.params.id;
    const existingProduct = await Data.findById(productId);
    if (!existingProduct) return res.status(404).send("Product not found");

    let ownerData =
      typeof req.body.owner === "string"
        ? JSON.parse(req.body.owner)
        : {
            Username: req.body.name,
            mob: req.body.mob,
            location: req.body.location,
          };

    const updateData = {
      title: req.body.title,
      description: req.body.description || req.body.desc,
      price: req.body.price,
      Category: req.body.Category || req.body.cat,
      owner: ownerData,
      emails: req.body.email || ownerData.emails,
      old: req.body.old,
    };
    const updatedProduct = await Data.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    let existingImageIds = [];
    if (req.body.existingImages) {
      try {
        existingImageIds = JSON.parse(req.body.existingImages);
      } catch {}
    }

    const currentImages = await Images.find({ productId });
    for (const img of currentImages) {
      if (!existingImageIds.includes(img._id.toString())) {
        const filePath = path.join(UPLOADS_FOLDER, img.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        await Images.findByIdAndDelete(img._id);
      }
    }

    const newFiles = req.files;
    for (const file of newFiles) {
      const outputFilename = `${Date.now()}-${file.originalname.replace(
        /\s/g,
        "_"
      )}.webp`;
      const outputPath = path.join(UPLOADS_FOLDER, outputFilename);

      await compressImage(file.path, outputPath);
      fs.unlinkSync(file.path);

      const newImage = new Images({
        filename: outputFilename,
        type: "image/webp",
        productId: productId,
      });
      await newImage.save();
    }

    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Delete product
app.post("/delete/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Data.findByIdAndDelete(productId);
    if (!deletedProduct) return res.status(404).send("Product not found");

    const images = await Images.find({ productId });
    for (const img of images) {
      const filePath = path.join(UPLOADS_FOLDER, img.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Images.deleteMany({ productId });

    res
      .status(200)
      .json({
        message: "Product deleted successfully",
        product: deletedProduct,
      });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Get product by ID or category
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const categories = ["Furnitures", "Electronics", "Vehicles", "Households"];

    if (categories.includes(id)) {
      const allProduct = await Data.find({ Category: id });
      const image = await Images.find({});
      const convertedImg = image.map((img) => ({
        filename: img.filename,
        type: img.type,
        productID: img.productId,
        id: img._id,
      }));
      res.json({ allProduct, image: convertedImg });
    } else {
      const product = await Data.find({ _id: id });
      const images = await Images.find({ productId: id });
      const convertedImg = images.map((img) => ({
        filename: img.filename,
        type: img.type,
        productID: img.productId,
        id: img._id,
      }));
      res.json({ product, images: convertedImg });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
