const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const quizBox = document.getElementById('quiz-box');
const resultScreen = document.getElementById('result-screen');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const progressText = document.getElementById('progress');
const timerText = document.getElementById('timer');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

const TOTAL_QUESTIONS = 10;
const QUESTION_TIME = 15;


const questions = [
  { question: "What is the capital of France?", answers: [{text:"Paris",correct:true},{text:"London",correct:false},{text:"Berlin",correct:false},{text:"Madrid",correct:false}]},
  { question: "Who painted the Mona Lisa?", answers: [{text:"Leonardo da Vinci",correct:true},{text:"Vincent Van Gogh",correct:false},{text:"Pablo Picasso",correct:false},{text:"Claude Monet",correct:false}]},
  { question: "Which planet is known as the Red Planet?", answers: [{text:"Mars",correct:true},{text:"Venus",correct:false},{text:"Jupiter",correct:false},{text:"Saturn",correct:false}]},
  { question: "What is the largest ocean on Earth?", answers: [{text:"Pacific Ocean",correct:true},{text:"Atlantic Ocean",correct:false},{text:"Indian Ocean",correct:false},{text:"Arctic Ocean",correct:false}]},
  { question: "What is the smallest prime number?", answers: [{text:"2",correct:true},{text:"1",correct:false},{text:"3",correct:false},{text:"5",correct:false}]},
  { question: "Which language is used to create web pages?", answers: [{text:"HTML",correct:true},{text:"Python",correct:false},{text:"C++",correct:false},{text:"Java",correct:false}]},
  { question: "Who wrote 'Hamlet'?", answers: [{text:"William Shakespeare",correct:true},{text:"Mark Twain",correct:false},{text:"Charles Dickens",correct:false},{text:"J.K. Rowling",correct:false}]},
  { question: "What gas do plants absorb?", answers: [{text:"Carbon Dioxide",correct:true},{text:"Oxygen",correct:false},{text:"Nitrogen",correct:false},{text:"Hydrogen",correct:false}]},
  { question: "Which country is known as the Land of the Rising Sun?", answers: [{text:"Japan",correct:true},{text:"China",correct:false},{text:"Thailand",correct:false},{text:"South Korea",correct:false}]},
  { question: "What currency is used in the United Kingdom?", answers: [{text:"Pound Sterling",correct:true},{text:"Euro",correct:false},{text:"Dollar",correct:false},{text:"Yen",correct:false}]},
  { question: "Which element has the chemical symbol 'O'?", answers: [{text:"Oxygen",correct:true},{text:"Gold",correct:false},{text:"Silver",correct:false},{text:"Osmium",correct:false}]},
  { question: "In which year did the Titanic sink?", answers: [{text:"1912",correct:true},{text:"1905",correct:false},{text:"1918",correct:false},{text:"1920",correct:false}]},
  { question: "What is the capital of Australia?", answers: [{text:"Canberra",correct:true},{text:"Sydney",correct:false},{text:"Melbourne",correct:false},{text:"Brisbane",correct:false}]},
  { question: "How many continents are there?", answers: [{text:"7",correct:true},{text:"5",correct:false},{text:"6",correct:false},{text:"8",correct:false}]},
  { question: "What is the boiling point of water at sea level?", answers: [{text:"100°C",correct:true},{text:"90°C",correct:false},{text:"110°C",correct:false},{text:"120°C",correct:false}]},
  { question: "Who is known as the Father of Computers?", answers: [{text:"Charles Babbage",correct:true},{text:"Alan Turing",correct:false},{text:"Bill Gates",correct:false},{text:"Steve Jobs",correct:false}]},
  { question: "Which planet is closest to the sun?", answers: [{text:"Mercury",correct:true},{text:"Venus",correct:false},{text:"Earth",correct:false},{text:"Mars",correct:false}]},
  { question: "How many colors are there in a rainbow?", answers: [{text:"7",correct:true},{text:"6",correct:false},{text:"8",correct:false},{text:"5",correct:false}]},
  { question: "Who discovered gravity?", answers: [{text:"Isaac Newton",correct:true},{text:"Albert Einstein",correct:false},{text:"Galileo Galilei",correct:false},{text:"Nikola Tesla",correct:false}]},
  { question: "What is the currency of Japan?", answers: [{text:"Yen",correct:true},{text:"Dollar",correct:false},{text:"Euro",correct:false},{text:"Won",correct:false}]},
  { question: "Which country gifted the Statue of Liberty to the USA?", answers: [{text:"France",correct:true},{text:"England",correct:false},{text:"Germany",correct:false},{text:"Italy",correct:false}]},
  { question: "Which is the largest planet in our solar system?", answers: [{text:"Jupiter",correct:true},{text:"Saturn",correct:false},{text:"Earth",correct:false},{text:"Neptune",correct:false}]},
  { question: "What is the main ingredient in sushi?", answers: [{text:"Rice",correct:true},{text:"Fish",correct:false},{text:"Seaweed",correct:false},{text:"Soy Sauce",correct:false}]},
  { question: "Who invented the telephone?", answers: [{text:"Alexander Graham Bell",correct:true},{text:"Thomas Edison",correct:false},{text:"Nikola Tesla",correct:false},{text:"Guglielmo Marconi",correct:false}]},
  { question: "What is the chemical symbol for gold?", answers: [{text:"Au",correct:true},{text:"Ag",correct:false},{text:"Gd",correct:false},{text:"Ga",correct:false}]},
  { question: "Which ocean is the deepest?", answers: [{text:"Pacific Ocean",correct:true},{text:"Atlantic Ocean",correct:false},{text:"Indian Ocean",correct:false},{text:"Arctic Ocean",correct:false}]},
  { question: "How many teeth does an adult human have?", answers: [{text:"32",correct:true},{text:"28",correct:false},{text:"30",correct:false},{text:"34",correct:false}]},
  { question: "What is the largest desert in the world?", answers: [{text:"Sahara",correct:true},{text:"Gobi",correct:false},{text:"Kalahari",correct:false},{text:"Arctic",correct:false}]},
  { question: "Which country has the largest population?", answers: [{text:"China",correct:true},{text:"India",correct:false},{text:"USA",correct:false},{text:"Indonesia",correct:false}]},
  { question: "What is the fastest land animal?", answers: [{text:"Cheetah",correct:true},{text:"Lion",correct:false},{text:"Tiger",correct:false},{text:"Leopard",correct:false}]},
  { question: "Which metal is liquid at room temperature?", answers: [{text:"Mercury",correct:true},{text:"Gold",correct:false},{text:"Silver",correct:false},{text:"Copper",correct:false}]},
  { question: "Which country won the first FIFA World Cup?", answers: [{text:"Uruguay",correct:true},{text:"Brazil",correct:false},{text:"Germany",correct:false},{text:"Argentina",correct:false}]},
  { question: "What is the hardest natural substance?", answers: [{text:"Diamond",correct:true},{text:"Gold",correct:false},{text:"Iron",correct:false},{text:"Platinum",correct:false}]},
  { question: "Which instrument has keys, pedals, and strings?", answers: [{text:"Piano",correct:true},{text:"Guitar",correct:false},{text:"Violin",correct:false},{text:"Flute",correct:false}]},
  { question: "Who was the first man to walk on the moon?", answers: [{text:"Neil Armstrong",correct:true},{text:"Buzz Aldrin",correct:false},{text:"Yuri Gagarin",correct:false},{text:"Michael Collins",correct:false}]},
  { question: "What does DNA stand for?", answers: [{text:"Deoxyribonucleic Acid",correct:true},{text:"Dinucleic Acid",correct:false},{text:"Deoxynucleic Acid",correct:false},{text:"Ribonucleic Acid",correct:false}]},
  { question: "Which city hosted the 2016 Summer Olympics?", answers: [{text:"Rio de Janeiro",correct:true},{text:"London",correct:false},{text:"Tokyo",correct:false},{text:"Beijing",correct:false}]},
  { question: "What is the tallest mountain in the world?", answers: [{text:"Mount Everest",correct:true},{text:"K2",correct:false},{text:"Kangchenjunga",correct:false},{text:"Lhotse",correct:false}]},
  { question: "Which animal is known as the King of the Jungle?", answers: [{text:"Lion",correct:true},{text:"Tiger",correct:false},{text:"Elephant",correct:false},{text:"Leopard",correct:false}]},
  { question: "What does HTTP stand for?", answers: [{text:"HyperText Transfer Protocol",correct:true},{text:"HyperText Transmission Protocol",correct:false},{text:"HyperText Transfer Procedure",correct:false},{text:"HyperText Transmission Procedure",correct:false}]},
  { question: "What year did World War II end?", answers: [{text:"1945",correct:true},{text:"1939",correct:false},{text:"1918",correct:false},{text:"1965",correct:false}]},
  { question: "What is the largest organ in the human body?", answers: [{text:"Skin",correct:true},{text:"Liver",correct:false},{text:"Heart",correct:false},{text:"Lungs",correct:false}]},
  { question: "Which country is famous for the Eiffel Tower?", answers: [{text:"France",correct:true},{text:"Italy",correct:false},{text:"Spain",correct:false},{text:"Germany",correct:false}]},
  { question: "Who wrote the 'Harry Potter' series?", answers: [{text:"J.K. Rowling",correct:true},{text:"Stephen King",correct:false},{text:"J.R.R. Tolkien",correct:false},{text:"Agatha Christie",correct:false}]},
  { question: "Which vitamin is produced when a person is exposed to sunlight?", answers: [{text:"Vitamin D",correct:true},{text:"Vitamin A",correct:false},{text:"Vitamin C",correct:false},{text:"Vitamin B12",correct:false}]},
  { question: "What is the largest land animal?", answers: [{text:"Elephant",correct:true},{text:"Rhinoceros",correct:false},{text:"Giraffe",correct:false},{text:"Hippopotamus",correct:false}]},
  { question: "How many players are there in a soccer team?", answers: [{text:"11",correct:true},{text:"10",correct:false},{text:"9",correct:false},{text:"12",correct:false}]},
  { question: "Which metal is best conductor of electricity?", answers: [{text:"Silver",correct:true},{text:"Copper",correct:false},{text:"Gold",correct:false},{text:"Aluminum",correct:false}]},
  { question: "Who painted the Sistine Chapel ceiling?", answers: [{text:"Michelangelo",correct:true},{text:"Leonardo da Vinci",correct:false},{text:"Raphael",correct:false},{text:"Donatello",correct:false}]},
  { question: "What is the main gas found in the air we breathe?", answers: [{text:"Nitrogen",correct:true},{text:"Oxygen",correct:false},{text:"Carbon Dioxide",correct:false},{text:"Hydrogen",correct:false}]},

  { question: "Which continent is Egypt located in?", answers: [{text:"Africa",correct:true},{text:"Asia",correct:false},{text:"Europe",correct:false},{text:"South America",correct:false}]},
  { question: "What is the name of the longest river in the world?", answers: [{text:"Nile",correct:true},{text:"Amazon",correct:false},{text:"Yangtze",correct:false},{text:"Mississippi",correct:false}]},
  { question: "Who developed the theory of relativity?", answers: [{text:"Albert Einstein",correct:true},{text:"Isaac Newton",correct:false},{text:"Galileo Galilei",correct:false},{text:"Nikola Tesla",correct:false}]},
  { question: "Which country is known as the Pearl of Africa?", answers: [{text:"Uganda",correct:true},{text:"Kenya",correct:false},{text:"Tanzania",correct:false},{text:"Ethiopia",correct:false}]},
  { question: "What is the capital of Canada?", answers: [{text:"Ottawa",correct:true},{text:"Toronto",correct:false},{text:"Vancouver",correct:false},{text:"Montreal",correct:false}]},
  { question: "How many bones are there in the adult human body?", answers: [{text:"206",correct:true},{text:"201",correct:false},{text:"210",correct:false},{text:"208",correct:false}]},
  { question: "Which planet has the most moons?", answers: [{text:"Saturn",correct:true},{text:"Jupiter",correct:false},{text:"Mars",correct:false},{text:"Neptune",correct:false}]},
  { question: "Who wrote 'Pride and Prejudice'?", answers: [{text:"Jane Austen",correct:true},{text:"Charlotte Brontë",correct:false},{text:"Emily Brontë",correct:false},{text:"Mary Shelley",correct:false}]},
  { question: "What is the chemical formula of water?", answers: [{text:"H2O",correct:true},{text:"CO2",correct:false},{text:"O2",correct:false},{text:"NaCl",correct:false}]},
  { question: "Which city is known as the Big Apple?", answers: [{text:"New York City",correct:true},{text:"Los Angeles",correct:false},{text:"Chicago",correct:false},{text:"San Francisco",correct:false}]},

  { question: "What is the capital of India?", answers: [{text:"New Delhi",correct:true},{text:"Mumbai",correct:false},{text:"Kolkata",correct:false},{text:"Chennai",correct:false}]},
  { question: "Who is the author of 'The Lord of the Rings'?", answers: [{text:"J.R.R. Tolkien",correct:true},{text:"C.S. Lewis",correct:false},{text:"George R.R. Martin",correct:false},{text:"J.K. Rowling",correct:false}]},
  { question: "What is the main language spoken in Brazil?", answers: [{text:"Portuguese",correct:true},{text:"Spanish",correct:false},{text:"English",correct:false},{text:"French",correct:false}]},
  { question: "Which is the smallest country in the world?", answers: [{text:"Vatican City",correct:true},{text:"Monaco",correct:false},{text:"San Marino",correct:false},{text:"Liechtenstein",correct:false}]},
  { question: "What is the name of the galaxy we live in?", answers: [{text:"Milky Way",correct:true},{text:"Andromeda",correct:false},{text:"Whirlpool",correct:false},{text:"Sombrero",correct:false}]},
  { question: "Which organ in the human body produces insulin?", answers: [{text:"Pancreas",correct:true},{text:"Liver",correct:false},{text:"Kidneys",correct:false},{text:"Heart",correct:false}]},
  { question: "Which animal is known for its black and white stripes?", answers: [{text:"Zebra",correct:true},{text:"Tiger",correct:false},{text:"Panda",correct:false},{text:"Skunk",correct:false}]},
  { question: "Who discovered penicillin?", answers: [{text:"Alexander Fleming",correct:true},{text:"Marie Curie",correct:false},{text:"Louis Pasteur",correct:false},{text:"Gregor Mendel",correct:false}]},
  { question: "What is the speed of light?", answers: [{text:"299,792 km/s",correct:true},{text:"150,000 km/s",correct:false},{text:"300,000 km/s",correct:false},{text:"200,000 km/s",correct:false}]},
  { question: "Which continent is also a country?", answers: [{text:"Australia",correct:true},{text:"Antarctica",correct:false},{text:"Europe",correct:false},{text:"South America",correct:false}]},
  { question: "What is the currency of Russia?", answers: [{text:"Ruble",correct:true},{text:"Dollar",correct:false},{text:"Euro",correct:false},{text:"Yuan",correct:false}]},
  { question: "Which sea creature has three hearts?", answers: [{text:"Octopus",correct:true},{text:"Shark",correct:false},{text:"Whale",correct:false},{text:"Dolphin",correct:false}]},
  { question: "Who is the founder of Microsoft?", answers: [{text:"Bill Gates",correct:true},{text:"Steve Jobs",correct:false},{text:"Mark Zuckerberg",correct:false},{text:"Larry Page",correct:false}]},
  { question: "Which instrument is used to measure temperature?", answers: [{text:"Thermometer",correct:true},{text:"Barometer",correct:false},{text:"Hygrometer",correct:false},{text:"Anemometer",correct:false}]},
  { question: "What is the freezing point of water?", answers: [{text:"0°C",correct:true},{text:"100°C",correct:false},{text:"32°C",correct:false},{text:"-10°C",correct:false}]},
  { question: "Who painted 'Starry Night'?", answers: [{text:"Vincent Van Gogh",correct:true},{text:"Pablo Picasso",correct:false},{text:"Claude Monet",correct:false},{text:"Salvador Dalí",correct:false}]},
  { question: "Which gas is most abundant in Earth's atmosphere?", answers: [{text:"Nitrogen",correct:true},{text:"Oxygen",correct:false},{text:"Carbon Dioxide",correct:false},{text:"Argon",correct:false}]},
  { question: "Which is the longest bone in the human body?", answers: [{text:"Femur",correct:true},{text:"Tibia",correct:false},{text:"Humerus",correct:false},{text:"Fibula",correct:false}]},
  { question: "Who is known as the Iron Man of India?", answers: [{text:"Sardar Vallabhbhai Patel",correct:true},{text:"Mahatma Gandhi",correct:false},{text:"Jawaharlal Nehru",correct:false},{text:"Subhas Chandra Bose",correct:false}]},
  { question: "Which planet is known for its rings?", answers: [{text:"Saturn",correct:true},{text:"Jupiter",correct:false},{text:"Uranus",correct:false},{text:"Neptune",correct:false}]}
];



startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  setNextQuestion();
});
restartBtn.addEventListener('click', startGame);

function startGame() {
  startScreen.classList.add('hide');
  resultScreen.classList.add('hide');
  quizBox.classList.remove('hide');
  score = 0;
  currentQuestionIndex = 0;
  shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  if (currentQuestionIndex < TOTAL_QUESTIONS) {
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    updateProgress();
    startTimer();
  } else {
    showResult();
  }
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(button, answer.correct));
    answerButtons.appendChild(button);
  });
}

function resetState() {
  clearInterval(timer);
  timeLeft = QUESTION_TIME;
  timerText.innerText = `Time: ${timeLeft}`;
  nextBtn.classList.add('hide');
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(button, correct) {
  Array.from(answerButtons.children).forEach(btn => {
    btn.disabled = true;
    setStatusClass(btn, btn === button && correct);
  });

  if(correct){
    correctSound.play();
    score++;
  } else {
    wrongSound.play();
  }
  clearInterval(timer);
  nextBtn.classList.remove('hide');
}

function setStatusClass(element, correct) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
  if(correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}

function updateProgress() {
  progressText.innerText = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
}

function startTimer() {
  timerText.innerText = `Time: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    timerText.innerText = `Time: ${timeLeft}`;
    if(timeLeft <= 0){
      clearInterval(timer);
      disableAnswers();
      nextBtn.classList.remove('hide');
    }
  }, 1000);
}

function disableAnswers(){
  Array.from(answerButtons.children).forEach(btn => btn.disabled = true);
}

function showResult() {
  quizBox.classList.add('hide');
  resultScreen.classList.remove('hide');
  scoreDisplay = document.getElementById('score');
  scoreDisplay.innerText = `${score} / ${TOTAL_QUESTIONS}`;
}
function goHome() {
  window.location.href = "../index.html"; 
}