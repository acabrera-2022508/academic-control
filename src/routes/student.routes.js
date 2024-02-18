import express from 'express';
import User from '../models/user.model.js';
import Course from '../models/courses.model.js';
import { hashPassword } from '../helpers/bcrypt.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { limitCoursesAssign } from '../middlewares/limitCoursesAssign.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, lastName, username, password } = req.body;

    const user = new User({
      name,
      lastName,
      username,
      password: await hashPassword(password),
      courses: [],
      role: 'STUDENT',
    });

    const users = await User.find({});

    let userAlreadyExists = users.some((user) => user.username === username);

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ message: 'Username already exists, use another' });
    }

    await user.save();

    return res.json({ message: 'Student registered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  '/assign/course',
  [isLoggedIn, limitCoursesAssign],
  async (req, res) => {
    try {
      const { courseName } = req.body;

      const course = await Course.findOne({ name: courseName });

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const user = await User.findById({ _id: req.user._id });

      let courseAlreadyAssigned = user.courses.some((courseId) => {
        console.log(courseId, course._id);

        return courseId.toString() === course._id.toString();
      });

      if (courseAlreadyAssigned)
        return res.status(400).json({ message: 'Course already assigned' });

      const addStudentCourses = await Course.findOne({ name: courseName });
      addStudentCourses.students.push(user._id);

      await addStudentCourses.save();

      user.courses.push(course._id);

      await user.save();

      return res.json({ message: 'Course assigned' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

router.get('/mycourses', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id }).populate({
      path: 'courses',
      select: 'name description teacher -_id',
      populate: {
        path: 'teacher',
        model: 'User',
        select: 'name lastName role -_id',
      },
    });

    return res.json(user.courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
