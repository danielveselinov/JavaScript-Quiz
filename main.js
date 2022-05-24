const API = `https://opentdb.com/api.php?amount=20`

// Menu's
const startGameMenu = document.getElementById('start_game')
const inGameMenu = document.getElementById('in_game')
const finishGameMenu = document.getElementById('finish_game')

// Buttons
const startGameBtn = document.getElementById('startGame')
const startOverBtn = document.getElementById('startOver')
const tryAgainBtn = document.getElementById('tryAgain')

// Div's
const answersDiv = document.getElementById('answers')
const resultsDiv = document.getElementById('result_score')
const loading = document.getElementById('loading')

// Points
const points = document.getElementById('counter_score')

// Counters 
let counter = 0
let correct_points = 0
let qID = 0

startGameBtn.addEventListener('click', function(){
    startGameMenu.style.display = 'none'

    inGameMenu.style.display = 'block'
    resultsDiv.style.display = 'block'
    points.innerText = `Completed: 0/20`

    location.hash = "#question-0"
})

startOverBtn.addEventListener('click', function() {
    counter = correct_points = qID = 0
    localStorage.removeItem('correct_points')
    location.href = './index.html'
})

tryAgainBtn.addEventListener('click', function() {
    counter = correct_points = qID = 0
    localStorage.removeItem('correct_points')
    location.href = './index.html'
})

window.addEventListener('load', function() {
    setTimeout(() => {
        loading.style.display = 'none'

        document.getElementById('content').style.display = 'block'
    }, 2000);
})

window.addEventListener('hashchange', function(){
    for (let i = 0; i < 20; i++) {
        if (location.hash == `#question-${i}`) {
            getQuestions()
            qID++
            points.innerText = `Completed: ${i}/20`
        } else if (location.hash == '#question-20') {
            inGameMenu.style.display = 'none'
            answersDiv.style.display = 'none'

            finishGameMenu.style.display = 'block'
            points.innerText = `Total Correct Answers: ${localStorage.getItem('correct_points')}/20`
        }
    }
})

function getQuestions() {
    fetch(API)
    .then(function(data) {
        return data.json()
    })
    .then(function(data) {
        const arrData = data.results
        arrData.forEach(function(val, index) {
            if (val.type == 'boolean') {
                answersDiv.innerHTML = `<div class='card' data-aos="zoom-in">
                <div class='card-header'>${val.question}</div>
                    <div class='card-body d-flex justify-content-center'>
                        <a href='#question-${qID}' data-answer='a' class='answer btn btn-outline-secondary mx-2'>${val.correct_answer}</a>
                        <a href='#question-${qID}' data-answer='a-0' class='answer btn btn-outline-secondary mx-2'>${val.incorrect_answers}</a>
                    </div>
                    <div class='card-footer'>${val.category}</div>
                </div>`
            } else if (val.type == 'multiple') {
                answersDiv.innerHTML = `<div class='card' data-aos="zoom-in">
                <div class='card-header'>${val.question}</div>
                    <div class='card-body d-flex justify-content-between'>
                        <a href='#question-${qID}' data-answer='a-0' class='answer btn btn-outline-secondary mx-2'>${val.incorrect_answers[0]}</a>
                        <a href='#question-${qID}' data-answer='a' class='answer btn btn-outline-secondary mx-2'>${val.correct_answer}</a>
                        <a href='#question-${qID}' data-answer='a-0' class='answer btn btn-outline-secondary mx-2'>${val.incorrect_answers[1]}</a>
                        <a href='#question-${qID}' data-answer='a-0' class='answer btn btn-outline-secondary mx-2'>${val.incorrect_answers[2]}</a>
                    </div>
                    <div class='card-footer'>${val.category}</div>
                </div>`
            }

            document.querySelectorAll('.answer').forEach(element => {
                element.addEventListener('click', function(event) {
                    let correctAnswer = element.getAttribute('data-answer')

                    if (correctAnswer == 'a') {
                        correct_points++
                        localStorage.setItem('correct_points', correct_points)
                    }
                })
            })
         })
    })
    .catch(function(err) {
        resultsDiv.innerHTML = `<p>Error: ${err}</p>`
    })
}