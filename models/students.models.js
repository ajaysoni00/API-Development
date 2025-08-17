import mongoose from "mongoose";
import { type } from "os";

const studentSchema = mongoose.Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  phone: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  profile_pic: {
    type: String,
  },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
