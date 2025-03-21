// StackTalk Backend (Single Service)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/stacktalk', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});
const User = mongoose.model('User', UserSchema);

// Question Schema
const QuestionSchema = new mongoose.Schema({
    username: String,
    title: String,
    body: String,
    answers: [{ username: String, answer: String }]
});
const Question = mongoose.model('Question', QuestionSchema);

// Create or fetch a user
app.post('/user', async (req, res) => {
    const { username } = req.body;
    let user = await User.findOne({ username });
    if (!user) user = await User.create({ username });
    res.json(user);
});

// Get all questions by a user
app.get('/user/:username/questions', async (req, res) => {
    const user = await User.findOne({ username: req.params.username }).populate('questions');
    res.json(user ? user.questions : []);
});

// Ask a new question
app.post('/questions', async (req, res) => {
    const { username, title, body } = req.body;
    const question = await Question.create({ username, title, body, answers: [] });
    const user = await User.findOne({ username });
    if (user) {
        user.questions.push(question._id);
        await user.save();
    }
    res.json(question);
});

// Get all questions
app.get('/questions', async (_, res) => {
    const questions = await Question.find();
    res.json(questions);
});

// Get a question and its answers
app.get('/questions/:id', async (req, res) => {
    const question = await Question.findById(req.params.id);
    res.json(question);
});

// Add an answer to a question
app.post('/questions/:id/answers', async (req, res) => {
    const { username, answer } = req.body;
    const question = await Question.findById(req.params.id);
    question.answers.push({ username, answer });
    await question.save();
    res.json(question);
});

app.listen(5000, () => console.log('StackTalk Backend running on port 5000'));