import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  },
  role : {
    type: String,
    enum: ['STUDENT', 'TEACHER'],
    required: true
  }
});

export default mongoose.model('Student', studentSchema);