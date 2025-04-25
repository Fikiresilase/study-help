const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  enrolledCourses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      progress: { type: Number, default: 0 }, 
      completedLessons: [{ type: String }], 
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
