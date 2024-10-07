
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const game = document.getElementById('game');

let currentQuestion = {};
let canAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = []; //remaining questions

// Get questions from API
fetch('https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple')
    .then((res) => res.json())
    .then((loadedQuestions) => {
        // Format questions
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const answerChoices = [...loadedQuestion.incorrect_answers];
            const answerIndex = Math.floor(Math.random() * 4);
            answerChoices.splice(answerIndex, 0, loadedQuestion.correct_answer);
            return {
                question: loadedQuestion.question,
                answer: answerIndex + 1,
                choice1: answerChoices[0],
                choice2: answerChoices[1],
                choice3: answerChoices[2],
                choice4: answerChoices[3],
            };
        });
        startGame(); // Start the game
    });

const numQuestions = 10; // Total questions

// Start the game
const startGame = function() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden'); // Show game UI
};

// Get a new question
const getNewQuestion = function() {
    if (questionCounter >= numQuestions) {
        localStorage.setItem('mostRecentScore', score); // Save score
        return window.location.assign('/lastpage.html'); // Redirect
    }

    questionCounter++;
    progressText.innerText = 'Question ' + questionCounter + '/' + numQuestions;
    progressBarFull.style.width = (questionCounter / numQuestions) * 100 + '%';

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = decodeHtml(currentQuestion.question);

    // Update answer options
    for (let index = 0; index < choices.length; index++) {
        choices[index].innerText = decodeHtml(currentQuestion['choice' + (index + 1)]) || '';
    }

    availableQuestions.splice(questionIndex, 1);
    canAnswer = true; // Enable answering
};

// Decode HTML so weird characters don't appear
const decodeHtml = function(html) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
};

// Handle answer choice clicks
choices.forEach((choice) => {
    choice.addEventListener('click', function(e) {
        if (!canAnswer) return; // Exit if not allowed

        canAnswer = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        // Determine feedback and update score
        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        if (classToApply === 'correct') score++;

        selectedChoice.parentElement.classList.add(classToApply);
        scoreText.innerText = score;

        // Delay before getting the next question so it loads things correctly
        setTimeout(function() {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});
