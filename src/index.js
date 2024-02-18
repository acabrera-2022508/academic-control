import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import connection from './database/mongo.js';
import 'dotenv/config';
import userRoutes from './routes/user.routes.js';
import studentRoutes from './routes/student.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import { hashPassword, comparePassword } from './helpers/bcrypt.js';
import User from './models/user.model.js';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

// Routes
app.use('/user', userRoutes);
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);
app.use('/courses', coursesRoutes);

// Start server
app.listen(port, async () => {
  await connection();

  // Create admin user
  const admin = await User({
    name: 'Josue',
    lastName: 'Noj',
    username: 'jnoj',
    password: await hashPassword('admin'),
    courses: [],
    role: 'TEACHER',
  });

  const users = await User.find({});

  if (users.length === 0) {
    await admin.save();
  }

  console.log(`Server running at port ${port}`);
});
