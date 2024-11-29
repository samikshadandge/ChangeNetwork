import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchQuizzes = async () => {
      const response = await axios.get('http://localhost:5000/quizzes');
      setQuizzes(response.data);
    };
    fetchQuizzes();
  }, []);

  const handleAnswerChange = (quizId, answer) => {
    setAnswers((prevAnswers) =>
      prevAnswers.filter((item) => item.quizId !== quizId).concat({ quizId, answer })
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/submitQuiz', { answers });
      setScore(response.data.score);
      setShowScoreModal(true); // Show the score popup
    } catch (error) {
      alert('Error submitting quiz');
    }
  };

  const closeScoreModal = () => {
    setShowScoreModal(false);
    navigate('/login'); // Redirect to login after closing the modal
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="text-center mb-4">Take the Quiz</h2>
              {quizzes.map((quiz, index) => (
                <div key={quiz._id} className="mb-4">
                  <h5>
                    {index + 1}. {quiz.question}
                  </h5>
                  <div>
                    {quiz.options.map((option, idx) => (
                      <div className="form-check" key={idx}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name={quiz._id}
                          id={`quiz-${quiz._id}-option-${idx}`}
                          value={option}
                          onChange={() => handleAnswerChange(quiz._id, option)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`quiz-${quiz._id}-option-${idx}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="d-grid mt-4">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Modal */}
      <Modal show={showScoreModal} onHide={closeScoreModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Quiz Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h4>Your Score: {score}</h4>
            <p className="mt-2">Thank you for taking the quiz!</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={closeScoreModal}>

ok          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Quiz;
