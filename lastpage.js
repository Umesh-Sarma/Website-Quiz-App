


const finalScore = document.getElementById('scoreValue');
const mostRecentScore = localStorage.getItem('mostRecentScore'); //retrieves from local storage

finalScore.innerText = mostRecentScore; 


