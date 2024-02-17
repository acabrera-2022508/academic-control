import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

export default mongoose.model('Course', courseSchema);