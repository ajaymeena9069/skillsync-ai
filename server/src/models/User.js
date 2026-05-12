import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please add password'],
  },
  role: {
    type: String,
    enum: ['user', 'recruiter'],
    default: 'user',
  },
  skills: [String],
  resumeUrl: String,
  parsedData: {
    experience: String,
    projects: [String],
    education: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', userSchema);