import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

import User from "./src/models/User.js";
import Quiz from "./src/models/Quiz.js";

import { generateJoinCode } from "./src/services/quizService.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// To Verify JWT Token
const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// To Register a new user
app.post("/api/auth/register", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ firstName, lastName, username, email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create and return JWT token
    const payload = { user: { id: user.id, username: user.username } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: { 
          id: user.id, 
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username, 
          email: user.email 
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and return JWT token
    const payload = { user: { id: user.id, username: user.username } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get current user
app.get("/api/auth/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get a specific user
app.get("/api/auth/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Create a new quiz
app.post("/api/quizzes", authMiddleware, async (req, res) => {
  try {
    const { gradeLevel, title, questions } = req.body;

    // Generate unique join code
    let joinCode;
    let isUnique = false;

    while (!isUnique) {
      joinCode = generateJoinCode();
      const existingQuiz = await Quiz.findOne({ joinCode });
      if (!existingQuiz) {
        isUnique = true;
      }
    }

    const newQuiz = new Quiz({
      title,
      gradeLevel,
      joinCode,
      questions,
      user: req.user.id,
    });

    const quiz = await newQuiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all quizzes for current user
app.get("/api/quizzes", authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get a quiz by join code (public route)
app.get("/api/quizzes/join/:code", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ joinCode: req.params.code }).populate('questions.options');

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    console.error("Error fetching quiz:", err.message);
    res.status(500).send({ message: "Server error" });
  }
});

// Get a specific quiz
app.get("/api/quizzes/:id", authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // This check ensures the quiz belongs to the authenticated user
    if (quiz.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(quiz);
  } catch (err) {
    // Error handling
  }
});

// Edit a Quiz
app.put("/api/quizzes/:id", async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    let quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Update fields
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.questions = questions || quiz.questions;

    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete a quiz
app.delete("/api/quizzes/:id", authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (!quiz.user || quiz.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Check if the quiz belongs to the user
    if (quiz.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Quiz.deleteOne({ _id: req.params.id });

    res.json({ message: "Quiz removed" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(500).send("Server error");
  }
});

// OpenAI Quiz Generation
app.post("/api/generate-quiz", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    console.log("Received prompt:", prompt);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // ✅ Updated prompt to force JSON output
    const jsonPrompt = `${prompt} Please format the response as valid JSON without Markdown. The structure should be:
    {
      "quizTitle": "Your Quiz Title",
      "questions": [
        {
          "question": "Question text?",
          "choices": ["A", "B", "C", "D"],
          "correctAnswer": "Correct answer"
        },
        ...
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: jsonPrompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log("OpenAI Response:", response);

    const aiResponseText = response.choices[0].message.content.trim();
    let quizData;

    // ✅ Attempt to parse JSON safely
    try {
      quizData = JSON.parse(aiResponseText);
    } catch (error) {
      console.error("Invalid JSON format from OpenAI:", aiResponseText);
      return res
        .status(500)
        .json({
          error: "OpenAI response is not valid JSON",
          rawResponse: aiResponseText,
        });
    }

    res.json(quizData);
  } catch (error) {
    console.error("Quiz generation failed:", error.response?.data || error);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});

app.post("/api/quizzes/submit-score", async (req, res) => {
  try {
    const { code, userId, score } = req.body;
    console.log("Received submission:", req.body); // Debugging log

    if (!code || !userId || score === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let quiz = await Quiz.findOne({ joinCode: code });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const existingParticipantIndex = quiz.participants.findIndex(
      (p) => p.user && p.user.toString() === userObjectId.toString()
    );

    if (existingParticipantIndex !== -1) {
      quiz.participants[existingParticipantIndex].score = score;
      quiz.participants[existingParticipantIndex].completedAt = new Date();
    } else {
      quiz.participants.push({
        user: userObjectId,
        score,
        completedAt: new Date(),
      });
    }

    await quiz.save();

    res.json({
      message: "Score submitted successfully",
      score,
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/quizzes/get-score/:id", authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("participants")

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    res.json(quiz)
  } catch (error) {
    console.error("Server error:", error.message)
    res.status(500).send("Server error")
  }
})

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
