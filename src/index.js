const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

//Middleware to parse JSON
app.use(express.json());

connectDB();

//Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req,res) => {
    res.json({
        message: "Server is running Successfully"
    });
});

// Users Route
app.use("/api/users", require("./routes/userRoutes"));

// Admin Route
app.use("/api/admin", require("./routes/adminRoutes"));

// Task Route
app.use("/api/tasks", require("./routes/taskRoutes"));

const PORT = process.env.PORT ||5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);