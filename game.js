let Game = {
    deck: null,
    players:{},
    playersTurn:null,
    turnDirection: 1,
    topCard: null,
    topCardColor: null,
    topCardValue: null
}

let playableCards = [ ]

function makeNewCards(){
    const cards = [
        'red_0',
        'red_1', 'red_2', 'red_3', 'red_4', 'red_5', 'red_6', 'red_7', 'red_8', 'red_9',
        'red_1', 'red_2', 'red_3', 'red_4', 'red_5', 'red_6', 'red_7', 'red_8', 'red_9',
        'red_skip', 'red_reverse', 'red_draw_two',
        'red_skip', 'red_reverse', 'red_draw_two',
        
        'green_0',
        'green_1', 'green_2', 'green_3', 'green_4', 'green_5', 'green_6', 'green_7', 'green_8', 'green_9',
        'green_1', 'green_2', 'green_3', 'green_4', 'green_5', 'green_6', 'green_7', 'green_8', 'green_9',
        'green_skip', 'green_reverse', 'green_draw_two',
        'green_skip', 'green_reverse', 'green_draw_two',
        
        'blue_0',
        'blue_1', 'blue_2', 'blue_3', 'blue_4', 'blue_5', 'blue_6', 'blue_7', 'blue_8', 'blue_9',
        'blue_1', 'blue_2', 'blue_3', 'blue_4', 'blue_5', 'blue_6', 'blue_7', 'blue_8', 'blue_9',
        'blue_skip', 'blue_reverse', 'blue_draw_two',
        'blue_skip', 'blue_reverse', 'blue_draw_two',
        
        'yellow_0',
        'yellow_1', 'yellow_2', 'yellow_3', 'yellow_4', 'yellow_5', 'yellow_6', 'yellow_7', 'yellow_8', 'yellow_9',
        'yellow_1', 'yellow_2', 'yellow_3', 'yellow_4', 'yellow_5', 'yellow_6', 'yellow_7', 'yellow_8', 'yellow_9',
        'yellow_skip', 'yellow_reverse', 'yellow_draw_two',
        'yellow_skip', 'yellow_reverse', 'yellow_draw_two',
        
        'wild_draw_four','wild_draw_four', 'wild', 'wild',
        'wild_draw_four','wild_draw_four', 'wild', 'wild',
    ]    
    
    return cards
}

// create a function that takes an array of cards 
// and returns a new array of shuffled cards
function shuffle( cards ){
    // create an array to hold the shuffled cards
    const deck = [ ]
    // algorithm to shuffle a deck of cards
    // as long as there are cards in the cards array
    while (cards.length > 0) {
        // pick a random number between 0 and the length of the cards array
        let randomNumber = Math.floor(Math.random() * cards.length)
        // then use that number to pick a card
        let card = cards[randomNumber]
        // console.log('card is '+card)
        // push that card onto the new deck
        deck.push(card)
        // remove the card from the original deck
        cards.splice(randomNumber, 1)        
    }
    return deck
}



function dealCard(deck){
    return deck.shift()
}


function startNewGame(){
    //create a new set of cards
    let cards = makeNewCards()
    //shuffle cards 
    let deck = shuffle(cards)
    //and attach them to the Game Object
    Game.deck = deck
    // add up to 4 playes to game object 
    //                     0        1      2          3
    const playerNames = ['Lucy', "Jose", "Ale", "WhiteBoy Vic"]
    const ALPHABET = ['A', 'B', 'C', "D", "E", "F", "G", "H", "I", "J"]
    for(let l = 0; l < playerNames.length; l++){
        let name = playerNames[l]
        let id = ALPHABET[l]
        let player = createNewPlayer(name, id)
        Game.players[id] = player
        
}

    //flip topcard
    
    let discard = dealCard(Game.deck)
    while(getColorOfCard(discard) == 'wild' || getCardValue(discard) == 'reverse' || getCardValue(discard) == 'skip' || getCardValue(discard) == 'draw_two'){
        Game.deck.push(discard)
        discard = dealCard(Game.deck)
    }
    
    Game.topCard = discard
    let topCard = document.querySelector("#deck")
    topCard.setAttribute("src", "images/"+discard+".png")
     
        Game.playersTurn = "A"
        
        
        showGameObject()
        
}

function createNewPlayer(playerName, id){
    //NAME, CARDS, POINTS 
    let player = {
        id: id,
        name: playerName,
        cards: [],
        points: 0
    }
    for (let k = 0; k < 7; k++){
        let card = dealCard(Game.deck)
        player.cards.push(card)
    }
    return player
}

function showGameObject(){
    var codeSection = document.querySelector('#game-object')
    codeSection.innerHTML = JSON.stringify(Game, null, 2)
}

function changePlayerTurn(){
//   const ALPHABET = ['A', 'B', 'C', "D", "E", "F", "G", "H", "I", "J"]
  let ALPHABET = Object.keys(Game.players)
  const currentPlayerId = Game.playersTurn
  const currentDirection = Game.turnDirection
  const idx = ALPHABET.indexOf(currentPlayerId)
  let newIdx = idx + currentDirection
  if (newIdx < 0){
      newIdx = ALPHABET.length - 1
    //   var keys = Object.keys(Game.players)
  }
  if(newIdx >= ALPHABET.length){
      newIdx = 0
  }
   const newPlayersTurn = ALPHABET[newIdx]
  Game.playersTurn = newPlayersTurn
  showGameObject()
}
function getColorOfCard( cardName ){
    const splitCard = cardName.split('_')
    const color = splitCard[0]
    return color
}

function getCardValue( cardName ){
    const removeCard = cardName.split('_')
    let value = removeCard[1]
    if (removeCard.length === 3){
        value += '_' + removeCard[2]
    }
    return value
}

function reversePlayersTurn(){
    Game.turnDirection *= -1
}

function skipTurn(){
    changePlayerTurn()
}

function playerDrawCard(){
    let card = dealCard(Game.deck)
    let playerId = Game.playersTurn
    Game.players[playerId].cards.push(card)
}

function playerDrawTwo(){
    changePlayerTurn()
    playerDrawCard()
    playerDrawCard()
}

function playerDrawFour(){
    changePlayerTurn()
    playerDrawCard()
    playerDrawCard()
    playerDrawCard()
    playerDrawCard()
}

function isCardPlayable(){
    let player = Game.playersTurn
    for(var i = 0; i < Game.players[player].cards.length; i++){
        if(getColorOfCard(Game.players[player].cards[i]) == Game.topCardColor || getCardValue(Game.players[player].cards[i]) == Game.topCardValue || getColorOfCard(Game.players[player].cards[i]) == 'wild'){
            console.log(Game.players[player].cards[i] + " is playable")
            playableCards.push(Game.players[player].cards[i])
        }
    }
    console.log(playableCards)
}


function playCard(){
    let player = Game.playersTurn
    isCardPlayable()
    if(playableCards.length < 1){
        alert("No card is playable so you will draw a card until you get one you can play")
        playerDrawCard()
        playCard()
    }
    if(playableCards.length >= 1){
    let cardPlayed = prompt("You can play one these cards "+playableCards)
    Game.topCard = cardPlayed
    Game.topCardColor = getColorOfCard(Game.topCard)
    Game.topCardValue = getCardValue(Game.topCard)
    let topCard = document.querySelector('#deck')
    topCard.setAttribute('src', 'images/'+Game.topCard+'.png')
    let cardPlayedLoc = Game.players[player].cards.indexOf(cardPlayed)
    Game.players[player].cards.splice(cardPlayedLoc, 1)
    changePlayerTurn()
    }
    if(Game.topCardValue === "draw_four"){
        playerDrawFour()
    }
    playableCards = [ ]
    showGameObject()
}

