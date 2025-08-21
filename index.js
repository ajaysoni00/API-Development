import express from "express";
const app = express();
import studentRoutes from "./routes/students.routes.js";
import userRoutes from "./routes/user.routes.js";
import auth from "./middlewares/auth.js";
import connectDB from "./config/database.js";
import cors from "cors";
import { MulterError } from "multer";

connectDB();

const port = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(cors());

app.use("/api/user", userRoutes);

app.use(auth);

app.use("/api/students", studentRoutes);

app.use((error, req, res, next) => {
  if (error instanceof MulterError) {
    return res.status(400).send(`Image Error:${error.message}: ${error.code}`);
  } else if (error) {
    return res.status(500).send(`Something went wrong: ${error.message}`);
  }
  next();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
