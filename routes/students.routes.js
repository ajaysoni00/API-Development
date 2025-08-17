import express from "express";
import Student from "../models/students.models.js";
const router = express.Router();

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
router.post("/", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Update Student
router.put("/:id", async (req, res) => {
  try {
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
      res.status(404).json({ message: "student does not found" });
    }
    res.json(deleteStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
