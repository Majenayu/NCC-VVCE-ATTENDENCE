const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use("/", routes);

// MongoDB Connection
mongoose.connect("mongodb+srv://Maj:Maj@ayu.daaxx.mongodb.net/AttendanceDB?retryWrites=true&w=majority", {
    serverSelectionTimeoutMS: 5000 // Wait for 5 seconds before failing
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB Connection Error:", err));



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
