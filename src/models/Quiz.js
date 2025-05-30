import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [optionSchema],
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  gradeLevel: {
    type: String,
    required: true,
  },
  joinCode: {
    type: String,
    index: true,
    unique: true,
  },
  questions: [questionSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: { type: Number, default: 0 },
      completedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
