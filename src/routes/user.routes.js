import express from 'express';
import User from '../models/user.model.js';
import Course from '../models/courses.model.js';
import { hashPassword, comparePassword } from '../helpers/bcrypt.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .select('-_id')
      .populate({
        path: 'courses',
        select: 'name description teacher -_id',
        populate: {
          path: 'teacher',
          model: 'User',
          select: 'name lastName role -_id',
        },
      });

    return res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'STUDENT' })
      .select('name lastName role courses -_id')
      .populate({
        path: 'courses',
        populate: {
          path: 'teacher',
          model: 'User',
          select: 'name lastName role -_id',
        },
      })
      .populate({
        path: 'courses',
        populate: {
          path: 'students',
          model: 'User',
          select: 'name lastName role -_id',
        },
        select: 'name description teacher students -_id',
      });

    return res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'TEACHER' })
      .select('name lastName role courses -_id')
      .populate({
        path: 'courses',
        populate: {
          path: 'teacher',
          model: 'User',
          select: 'name lastName role -_id',
        },
      })
      .populate({
        path: 'courses',
        populate: {
          path: 'students',
          model: 'User',
          select: 'name lastName role -_id',
        },
        select: 'name description teacher students -_id',
      });

    return res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    let data = req.body;
    const courses = await Course.find({ name: data.courses });

    data.password = await hashPassword(data.password);
    data.courses = courses.map((course) => course._id);

    const user = new User(data);

    await user.save();
    res.send('User added!');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
