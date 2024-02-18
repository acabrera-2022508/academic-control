import express from 'express';
import Course from '../models/courses.model.js';
import User from '../models/user.model.js';
import { isTeacher } from '../middlewares/isTeacher.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.post('/create', [isLoggedIn, isTeacher], async (req, res) => {
  try {
    const { name, description, teacher } = req.body;

    const course = new Course({
      name,
      description,
      teacher: await User.findOne({ username: teacher }).select('_id'),
    });

    const courses = await Course.find({});

    if (!course.teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    let courseAlreadyExists = courses.some(
      (course) => course.name === name,
    );

    if (courseAlreadyExists) {
      return res.status(400).json({ message: 'Course already exists' });
    }

    await course.save();

    return res.json({ message: 'Course created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const courses = await Course.find({}).populate({
      path: 'teacher',
      model: 'User',
      select: 'name lastName -_id',
    });

    return res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
