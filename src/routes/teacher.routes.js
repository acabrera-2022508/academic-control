import express from 'express';
import User from '../models/user.model.js';
import Course from '../models/courses.model.js';
import { hashPassword } from '../helpers/bcrypt.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isTeacher } from '../middlewares/isTeacher.js';

const router = express.Router();

router.post('/register', [isLoggedIn, isTeacher], async (req, res) => {
  try {
    const { name, lastName, username, password } = req.body;

    const user = new User({
      name,
      lastName,
      username,
      password: await hashPassword(password),
      courses: [],
      role: 'TEACHER',
    });

    const users = await User.find({});

    let userAlreadyExists = users.some((user) => user.username === username);

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ message: 'Username already exists, use another' });
    }

    await user.save();

    return res.json({ message: 'Teacher registered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/mycourses', [isLoggedIn, isTeacher], async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id }).populate({
      path: 'courses',
      select: 'name description -_id',
    });

    return res.json(user.courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/assign/course', [isLoggedIn, isTeacher], async (req, res) => {
  try {
    const { courseName } = req.body;

    const course = await Course.findOne({ name: courseName });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById({ _id: req.user._id });

    let courseAlreadyAssigned = user.courses.some((courseId) => {
      return courseId.toString() === course._id.toString();
    });

    if (courseAlreadyAssigned)
      return res.status(400).json({ message: 'Course already assigned' });

    user.courses.push(course._id);

    await user.save();

    return res.json({ message: 'Course assigned' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  '/assign/course/:studentUserName',
  [isLoggedIn, isTeacher],
  async (req, res) => {
    try {
      let { studentUserName } = req.params;
      let { courseName } = req.body;

      let student = await User.findOne({ username: studentUserName });
      let courseToAssign = await Course.findOne({ name: courseName });

      if (!student) {
        return res.status(404).json({
          message: "user does'nt exists",
        });
      }

      if (!courseToAssign)
        return res.status(404).json({
          message: "Course does'nt exists",
        });

      let courseAlreadyAssigned = student.courses.some(
        (courseId) => courseId.toString() === courseToAssign._id.toString(),
      );

      if (courseAlreadyAssigned)
        return res.status(400).json({ message: 'Course already assigned' });

      student.courses.push(courseToAssign._id);
      await student.save();

      return res.status(200).json(student);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
);

// router.post()

router.put(
  '/update/course/:course',
  [isLoggedIn, isTeacher],
  async (req, res) => {
    try {
      const { course } = req.params;
      const { name, description } = req.body;

      const courseToUpdate = await Course.findOne({ name: course });

      if (!courseToUpdate) {
        return res.status(404).json({ message: 'Course not found' });
      }

      await Course.findOneAndUpdate(
        { name: course },
        { name, description },
        { new: true },
      );

      return res.json({ message: 'Course updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

router.delete(
  '/delete/course/:course',
  [isLoggedIn, isTeacher],
  async (req, res) => {
    try {
      const { course } = req.params;

      const courseToDelete = await Course.findOne({ name: course });

      if (!courseToDelete) {
        return res.status(404).json({ message: 'Course not found' });
      }

      await Course.findOneAndDelete({ name: course });

      const users = await User.find({ courses: courseToDelete._id });

      users.forEach(async (user) => {
        user.courses = user.courses.filter(
          (courseId) => courseId.toString() !== courseToDelete._id.toString(),
        );

        await user.save();
      });

      return res.json({ message: 'Course deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

export default router;
