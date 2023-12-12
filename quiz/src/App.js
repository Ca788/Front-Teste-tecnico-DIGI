import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/questions");
      setQuestions(response.data);
      setShowQuiz(true);
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
    }
  };

  const optionClicked = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const sendQuizResult = async () => {
    try {
      await axios.post("http://localhost:5000/quiz-results", {
        username: username,
        score: score,
      });
    } catch (error) {
      console.error("Erro ao enviar resultado do quiz:", error);
    }
  };

  useEffect(() => {
    if (showResults) {
      sendQuizResult();
    }
  }, [showResults]);

  return (
    <div className="App">
      {!showQuiz && !showResults && (
        <div className="start-form">
          <h1>Quiz</h1>
          <input
            type="text"
            placeholder="Insira seu nome"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={fetchQuestions}>Iniciar Quiz</button>
        </div>
      )}

      {showQuiz && !showResults && (
        <div className="question-card">
          <h1>Quiz</h1>
          <h2>
            Questão: {currentQuestion + 1} de {questions.length}
          </h2>
          <h3 className="question-text">
            {questions[currentQuestion]?.description}
          </h3>

          <ul>
            {questions[currentQuestion]?.alternatives.map((option) => {
              return (
                <li
                  key={option._id}
                  onClick={() => optionClicked(option.isCorrect)}
                >
                  {option.text}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {showResults && (
        <div className="final-results">
          <h1>Resultado</h1>
          <h2>
            {score} de {questions.length} corretas -{" "}
            {(score / questions.length) * 100}%
          </h2>
          <h3>Nome do usuário: {username}</h3>
          <button onClick={restartGame}>Jogar Novamente</button>
        </div>
      )}
    </div>
  );
}

export default App;
