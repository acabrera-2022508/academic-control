import express from "express";
import Course from "../models/courses.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({}).populate("students");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/add", async (req, res) => {
  let course = new Course(req.body);

  await course.save();

  res.send("Hello World from course routes!");
});

export default router;
