let deckId
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScore = document.getElementById('computer-score')
const playerScore = document.getElementById('player-score')

let cpuCurrentScore = 0
let playerCurrentScore = 0

/*
Following can be written as this also with Async and wait.

async function handleClick() {
    const response = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    const data = await response.json()
*/


function handleClick() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            deckId = data.deck_id
            console.log(deckId)
            resetScore()
            drawCardBtn.disabled = false
            header.textContent = `👊 CARD FIGHTER 👊`
            
        })
}

function resetScore() {
    
    cpuCurrentScore = 0
    playerCurrentScore = 0
    computerScore.textContent = `Computer Score: ${cpuCurrentScore}`
    playerScore.textContent = `Your Score: ${playerCurrentScore}`
    cardsContainer.children[0].innerHTML = ``
    cardsContainer.children[1].innerHTML = ``
    
}

newDeckBtn.addEventListener("click", handleClick)

/*
Following can be written as this also with Async and await

drawCardBtn.addEventListener("click", async () => {
    const response = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    const data = await response.json()
*/

drawCardBtn.addEventListener("click", () => {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            const winnerText = determineCardWinner(data.cards[0], data.cards[1])
            header.textContent = winnerText
            
            /*
            Another way of doing the above code
            
            const cards = document.getElementById('cards')
            for (const [index, child] of [...cards.children].entries()){
                child.innerHTML = `<img src=${data.cards[index].image} class="card" />`
                console.log(child)
            }

            */

            if (data.remaining === 0) {
                drawCardBtn.disabled = true
                if(cpuCurrentScore < playerCurrentScore){
                   header.textContent = `YOU WON!!! 🥳`
                } else if (cpuCurrentScore > playerCurrentScore){
                    header.textContent = `YOU LOST!!! 🥲`
                } else {
                    header.textContent = `It's a Tie 🥸`

                }
            }
            
            
        })
})


/**
 * Challenge:
 * 
 * Keep score! Every time the computer wins a hand, add a point to
 * the computer's score. Do the same for every time you win a hand.
 * If it's a war, no points are awarded to either player. If it's 
 * a war (same card values), no one is awarded points.
 * 
 * Display the computer's score above the top card, display your
 * own score BELOW the bottom card.
 * 
 * Track the scores in a global variable defined at the top of this file
 * 
 * Add to the global scores inside the `determineCardWinner` function below.
 */

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)
    
    if (card1ValueIndex > card2ValueIndex) {
        cpuCurrentScore++ 
        computerScore.textContent = `Computer Score: ${cpuCurrentScore}`
        return "CPU got score! 🙀"
    } else if (card1ValueIndex < card2ValueIndex) {
        playerCurrentScore++
        playerScore.textContent = `Your Score: ${playerCurrentScore}`
        startConfetti()
        return "YOU got score! 😝"
    } else {
        return "No Score! 😥"
    }
}

// CONFETTE

function startConfetti() {
  const container = document.getElementById('confetti-container');
  
  for (let i = 0; i < 50; i++) {
    let confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.left = `${Math.random() * 100}vw`;
    container.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000); // Remove after animation
  }
}

function getRandomColor() {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  return colors[Math.floor(Math.random() * colors.length)];
}