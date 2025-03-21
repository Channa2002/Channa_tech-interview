import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username) {
      await axios.post('http://localhost:5000/user', { username });
      navigate('/questions', { state: { username } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Enter a Unique Username</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          className="border p-2 mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Enter</button>
      </form>
    </div>
  );
}

function Questions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get('http://localhost:5000/questions').then(res => setQuestions(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">All Questions</h1>
      <button className="bg-green-500 text-white px-4 py-2 rounded mt-2" onClick={() => navigate('/ask')}>Ask a Question</button>
      <ul className="mt-4">
        {questions.map(q => (
          <li key={q._id} className="border p-2 mt-2 cursor-pointer" onClick={() => navigate(`/questions/${q._id}`)}>
            <strong>{q.title}</strong> - {q.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AskQuestion() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/questions', { username: 'User1', title, body });
    navigate('/questions');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Ask a Question</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input type="text" className="border p-2 mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="border p-2 mb-2" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)}></textarea>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Submit</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/ask" element={<AskQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;
