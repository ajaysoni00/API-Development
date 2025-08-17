import express from "express";
import Student from "../models/students.models.js";
const router = express.Router();
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const newFilename = Date.now() + path.extname(file.originalname);
    cb(null, newFilename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only Images are allowed"), false);
  }
};

const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

//Get all Students
router.get("/", async (req, res) => {
  try {
    const studentsData = await Student.find();
    res.json(studentsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Get a single Student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404).json({ message: "student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Add new Student
router.post("/", uploads.single("profile_pic"), async (req, res) => {
  try {
    const student = new Student(req.body);
    if (req.file) {
      student.profile_pic = req.file.filename;
    }
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Update Student
router.put("/:id", uploads.single("profile_pic"), async (req, res) => {
  try {
    const exist = await Student.findById(req.params.id);
    if (!exist) {
      if (req.file) {
        const filepath = path.join("./uploads", req.file.filename);
        fs.unlink(filepath, (err) => {
          if (err) {
            console.log(`Image is not deleted Old Image: ${err}`);
          }
        });
      }
      return res.status(404).json({ message: "Student not found" });
    }
    if (req.file) {
      if (exist.profile_pic) {
        const oldImagePath = path.join("./uploads", exist.profile_pic);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.log(`Image is not deleted Old Image: ${err}`);
          }
        });
      }

      req.body.profile_pic = req.file.filename;
    }
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedStudent) {
      res.status(404).json({ message: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Delete Student
router.delete("/:id", async (req, res) => {
  try {
    const deleteStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deleteStudent) {
      return res.status(404).json({ message: "student does not found" });
    }
    if (deleteStudent.profile_pic) {
      const myPath = path.join("./uploads", deleteStudent.profile_pic);
      fs.unlink(myPath, (err) => {
        if (err) {
          console.log(`Image is not deleted: ${err}`);
        }
      });
    }
    res.json({ message: "students delelted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
