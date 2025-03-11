const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 10000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images
app.use("/", routes);
app.use(cors({ origin: "*" })); // Allow all origins


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    serverSelectionTimeoutMS: 5000 // Wait for 5 seconds before failing
)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

// Define Image Schema
const imageSchema = new mongoose.Schema({
    date: { type: String, required: true },
    images: [{ type: String, required: true }] // Stores file paths
});
const ImageUpload = mongoose.model("ImageUpload", imageSchema);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

// Serve HTML File
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Login Route
app.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        res.status(200).json({ message: "Login successful!", user: { name: user.name } });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});

// Register Route
app.post("/register", async (req, res) => {
    try {
        const { name, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new User({ name, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});

// Image Upload Route
app.post("/upload", upload.array("images", 10), async (req, res) => {
    try {
        const { date } = req.body;
        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

        // Store in MongoDB
        const newUpload = new ImageUpload({ date, images: imagePaths });
        await newUpload.save();

        res.status(201).json({ message: "Images uploaded successfully!", images: imagePaths });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});



// Fetch uploaded images by date
app.get("/images", async (req, res) => {
    try {
        const images = await ImageUpload.find(); // Fetch all image documents

        if (!images.length) {
            return res.status(404).json({ message: "No images found" });
        }

        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});




// Replace Image Route
app.post("/replace-image", upload.single("newImage"), async (req, res) => {
    try {
        const { oldImage, date } = req.body;
        const newImagePath = `/uploads/${req.file.filename}`;

        // Find the document
        const doc = await ImageUpload.findOne({ date });
        if (!doc) {
            return res.status(404).json({ message: "Image document not found!" });
        }

        // Remove old image and add new image
        const updatedImages = doc.images.filter(img => img !== oldImage);
        updatedImages.push(newImagePath);

        // Update the document
        doc.images = updatedImages;
        await doc.save();

        // Delete old image from storage
        const oldImagePath = path.join(__dirname, oldImage);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        res.json({ message: "Image replaced successfully!", updatedImages: doc.images });
    } catch (error) {
        console.error("Error replacing image:", error);
        res.status(500).json({ message: "Server error, try again later." });
    }
});





// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
