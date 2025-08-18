import express from "express";
const app = express();
import studentRoutes from "./routes/students.routes.js";
import connectDB from "./config/database.js";
import cors from "cors";

connectDB();

const port = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use("/api/students", studentRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
