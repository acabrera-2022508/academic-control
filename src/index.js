import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import connection from './database/mongo.js';
import 'dotenv/config';
import userRoutes from './routes/user.routes.js';
import studentRoutes from './routes/student.routes.js';
import teacherRoutes from './routes/teacher.routes.js';

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

// Start server
app.listen(port, async () => {
  await connection();
  console.log(`Server running at port ${port}`);
});
