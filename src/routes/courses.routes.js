import express from 'express';
import Course from '../models/courses.model.js';
import User from '../models/user.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({})
      .select('name description teacher -_id')
      .populate({
        path: 'teacher',
        model: 'User',
        select: 'name lastName role -_id',
      });

    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/detailed', async (req, res) => {
  try {
    const courses = await Course.find({})
      .select('name description teacher students -_id')
      .populate({
        path: 'teacher',
        model: 'User',
        select: 'name lastName role -_id',
      })
      .populate({
        path: 'students',
        model: 'User',
        select: 'name lastName role -_id',
      });

    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const data = req.body;

    const teacher = await User.findOne({ username: data.teacher });
    const student = await User.findOne({ username: data.students });

    if (!teacher || !student) {
      return res.status(404).json({ message: 'Teacher or student not found' });
    }

    data.teacher = teacher._id;
    data.students = student._id;

    const course = new Course(data);
    
    await User.findOneAndUpdate(
      { _id: course.students },
      { courses: course._id },
    );

    await User.findOneAndUpdate(
      { _id: course.teacher },
      { courses: course._id },
    );

    await course.save();

    return res.send('Course added!');
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
