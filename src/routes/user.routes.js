import express from 'express';
import User from '../models/user.model.js';
import Course from '../models/courses.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  let users = await User.find({}).populate('courses');

  res.send(users);
});

router.post('/add', async (req, res) => {

});

export default router;