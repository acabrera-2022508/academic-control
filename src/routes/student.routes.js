import express from 'express';
import User from '../models/user.model.js';
import Course from '../models/courses.model.js';
import { hashPassword, comparePassword } from '../helpers/bcrypt.js';
import { generateToken } from '../helpers/jwt.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isTeacher } from '../middlewares/isTeacher.js';

const router = express.Router();



export default router;
